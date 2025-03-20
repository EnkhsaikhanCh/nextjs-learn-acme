// src/app/api/graphql/resolvers/mutations/payment/create-payment-mutation.ts
import { GraphQLError } from "graphql";
import { CourseModel, PaymentModel, UserModel } from "../../../models";
import { CreatePaymentInput } from "@/generated/graphql";
import TelegramBot from "node-telegram-bot-api";

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, {
  polling: false,
});

export const createPayment = async (
  _: unknown,
  { input }: { input: CreatePaymentInput },
) => {
  const { userId, courseId, amount, paymentMethod, transactionNote } = input;

  if (!userId || !courseId || !amount || !paymentMethod) {
    throw new GraphQLError(
      "Missing required fields: userId, courseId, amount, paymentMethod",
      {
        extensions: { code: "BAD_USER_INPUT" },
      },
    );
  }

  try {
    const userExists = await UserModel.findById(userId);
    if (!userExists) {
      throw new GraphQLError("User not found", {
        extensions: { code: "USER_NOT_FOUND" },
      });
    }

    const courseExists = await CourseModel.findById(courseId);
    if (!courseExists) {
      throw new GraphQLError("Course not found", {
        extensions: { code: "COURSE_NOT_FOUND" },
      });
    }

    // Төлбөр үүсгэх
    const payment = new PaymentModel({
      userId,
      courseId,
      amount,
      status: "PENDING",
      paymentMethod,
      transactionNote,
    });

    await payment.save();

    // Telegram мэдэгдэл илгээх
    const adminChatId = process.env.ADMIN_CHAT_ID;
    if (adminChatId) {
      const envLabel =
        process.env.NODE_ENV === "development"
          ? "[DEV] "
          : process.env.VERCEL_ENV === "preview"
            ? "[Preview] "
            : "";

      const message = `
🚀 *${envLabel}Төлбөр шалгах хүсэлт*  

👤 **Хэрэглэгч ID:** *${userExists.studentId}*  
📚 **Сургалт:** *${courseExists.title}*  
💰 **Гүйлгээний дүн:** *${amount}₮*  
📝 **Төлбөрийн утга:** *${transactionNote}* 

✅ *Системд нэвтрэн шалгаж баталгаажуулна уу.*
      `;

      await bot.sendMessage(adminChatId, message, { parse_mode: "Markdown" });
    }

    return payment;
  } catch (error) {
    const message = (error as Error).message;
    console.error("❌ Error creating payment:", message);
    throw new GraphQLError("Internal server error", {
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    });
  }
};
