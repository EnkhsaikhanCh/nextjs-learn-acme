// src/lib/email.ts
// import { Resend } from "resend";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
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
    // const info = await resend.emails.send({
    //   from: "YourApp <no-reply@yourapp.com>",
    //   to,
    //   subject,
    //   html,
    // });

    console.log(`И-мэйл илгээгдсэн: ${info.messageId}`);
    // console.log(`И-мэйл илгээгдсэн: ${info}`);
    return info;
  } catch (error) {
    console.error("И-мэйл илгээхэд алдаа гарлаа:", error);
    throw new Error("И-мэйл илгээхэд алдаа гарлаа.");
  }
}
