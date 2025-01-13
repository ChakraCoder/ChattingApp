import nodemailer from "nodemailer";
import {
  FRONTEND_DEVELOPMENT_URL,
  FRONTEND_DEPLOYED_URL,
  FRONTEND_ENV,
  SMTP_HOST,
  SMTP_PASSWORD,
  SMTP_PORT,
  SMTP_USER,
} from "../config";
import path from "path";
import fs from "fs";

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: false,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
});

export const sendOtpEmail = async (
  email: string,
  otp: number,
): Promise<boolean> => {
  try {
    const templatePath = path.join(
      __dirname,
      "../templates",
      "otpTemplate.html",
    );
    const htmlTemplate = fs.readFileSync(templatePath, "utf-8");
    const currentDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const htmlContent = htmlTemplate
      .replace("{{otp}}", otp.toString())
      .replace("{{date}}", currentDate);

    const mailOptions = {
      from: SMTP_USER,
      to: email,
      subject: "Your OTP Code",
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send OTP email");
  }
};

export const sendResetPasswordEmail = async (
  email: string,
  token: string,
): Promise<boolean> => {
  const templatePath = path.join(
    __dirname,
    "../templates",
    "resetPasswordTemplate.html",
  );
  const htmlTemplate = fs.readFileSync(templatePath, "utf-8");
  const resetUrl = `${FRONTEND_ENV === "development" ? FRONTEND_DEVELOPMENT_URL : FRONTEND_DEPLOYED_URL}/reset-password/${token}`;

  const htmlContent = htmlTemplate.replace("{{resetUrl}}", resetUrl);

  const mailOptions = {
    from: SMTP_USER,
    to: email,
    subject: "Reset Your Password",
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};
