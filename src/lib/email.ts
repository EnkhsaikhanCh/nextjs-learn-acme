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
    !process.env.VERCEL_ENV?.includes("preview");

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

  // Орчноос хамаарсан from имэйл хаяг
  const fromEmail = isProduction
    ? `"YourApp" <${process.env.PRODUCTION_SENDER_EMAIL}>` // Production-д
    : '"YourApp" <no-reply@yourapp.com>'; // Local болон Preview-д

  const mailOptions = {
    from: fromEmail,
    to,
    subject,
    html,
  };

  try {
    const info = await transport.sendMail(mailOptions);
    return info;
  } catch {
    throw new Error("И-мэйл илгээхэд алдаа гарлаа.");
  }
}
