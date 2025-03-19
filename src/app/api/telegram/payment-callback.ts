import { EnrollmentModel, PaymentModel } from "../graphql/models";
import { createEnrollment } from "../graphql/resolvers/mutations/enrollment/create-enrollment";
import { bot } from "./bot";

// Callback Query хүлээн авах
bot.on("callback_query", async (callbackQuery) => {
  console.log("Callback received:", JSON.stringify(callbackQuery, null, 2));

  // Callback query-г баталгаажуулах
  await bot.answerCallbackQuery(callbackQuery.id, {
    text: "Үйлдэл хийгдлээ", // Сонгосон үйлдлийн утга
    show_alert: false, // true бол alert харуулах, false бол inline notification
  });

  if (!callbackQuery.data || !callbackQuery.message) {
    console.error("Invalid callback query: missing data or message");
    return;
  }

  const { data, message } = callbackQuery;
  if (!data.includes("_")) {
    console.error("Invalid callback data format:", data);
    await bot.sendMessage(message.chat.id, "⚠️ Invalid callback data.");
    return;
  }

  const [action, paymentId] = data.split("_");
  console.log("Action:", action, "Payment ID:", paymentId);

  try {
    const payment = await PaymentModel.findById(paymentId);
    if (!payment) {
      console.log(`❌ Payment not found with ID: ${paymentId}`);
      await bot.sendMessage(message.chat.id, "❌ Төлбөр олдсонгүй.");
      return;
    }

    console.log(`✅ Payment found: ${payment._id}, Status: ${payment.status}`);

    if (action === "approve") {
      if (payment.status === "APPROVED") {
        await bot.sendMessage(
          message.chat.id,
          "✅ Энэ төлбөр аль хэдийн баталгаажсан байна.",
        );
        return;
      }

      payment.status = "APPROVED";
      await payment.save();

      let enrollment = await EnrollmentModel.findOne({
        userId: payment.userId,
        courseId: payment.courseId,
      });

      if (enrollment) {
        const now = new Date();
        const currentExpiryDate = enrollment.expiryDate
          ? new Date(enrollment.expiryDate)
          : now;
        const newExpiryDate = new Date(
          Math.max(now.getTime(), currentExpiryDate.getTime()),
        );
        newExpiryDate.setMonth(newExpiryDate.getMonth() + 1);

        enrollment.expiryDate = newExpiryDate;
        enrollment.status = "ACTIVE";
        await enrollment.save();
      } else {
        enrollment = await createEnrollment(null, {
          input: { userId: payment.userId, courseId: payment.courseId },
        });
        const now = new Date();
        now.setMonth(now.getMonth() + 1);
        enrollment.expiryDate = now;
        await enrollment.save();
      }

      await bot.sendMessage(
        message.chat.id,
        `✅ Төлбөр ${payment.amount}₮ баталгаажлаа.`,
      );
      console.log("✅ Approve action completed");
    } else if (action === "reject") {
      if (payment.status === "REJECTED") {
        await bot.sendMessage(
          message.chat.id,
          "❌ Энэ төлбөр аль хэдийн татгалзсан байна.",
        );
        return;
      }

      payment.status = "REJECTED";
      await payment.save();

      await bot.sendMessage(
        message.chat.id,
        `❌ Төлбөр ${payment.amount}₮ татгалзлаа.`,
      );
      console.log("✅ Reject action completed");
    } else {
      await bot.sendMessage(message.chat.id, "⚠️ Unknown action.");
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Callback query error:", error.message, error.stack);
    } else {
      console.error("Callback query error:", error);
    }
    await bot.sendMessage(
      message.chat.id,
      "⚠️ Системийн алдаа гарлаа, админд хандана уу.",
    );
  }
});
