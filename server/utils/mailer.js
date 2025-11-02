import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const response = await resend.emails.send({
      from: "Media Capture App <noreply@workreveal.space>", // ✅ verified domain sender
      to,
      subject,
      html,
    });

    console.log("✅ Email sent successfully:", response);
  } catch (err) {
    console.error("❌ Email send failed:", err);
  }
};
