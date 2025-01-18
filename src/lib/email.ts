import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const isProduction =
    process.env.NODE_ENV === "production" &&
    !process.env.VERCEL_ENV?.includes("preview"); // preview орчныг production-оос ялгах

  const transport = nodemailer.createTransport({
    host: isProduction ? process.env.SMTP_HOST : process.env.MAILTRAP_HOST,
    port: isProduction
      ? Number(process.env.SMTP_PORT)
      : Number(process.env.MAILTRAP_PORT),
    auth: {
      user: isProduction ? process.env.SMTP_USER : process.env.MAILTRAP_USER,
      pass: isProduction ? process.env.SMTP_PASS : process.env.MAILTRAP_PASS,
    },
  });

  const mailOptions = {
    from: '"YourApp" <no-reply@yourapp.com>',
    to,
    subject,
    html,
  };

  try {
    const info = await transport.sendMail(mailOptions);
    console.log(`И-мэйл илгээгдсэн: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error("И-мэйл илгээхэд алдаа гарлаа:", error);
    throw new Error("И-мэйл илгээхэд алдаа гарлаа.");
  }
}
