/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from "nodemailer";

import AppError from "../errorHelpers/AppError";
import status from "http-status";
import { envVars } from "../config/env";

const transporter = nodemailer.createTransport({
  host: envVars.EMAIL_SENDER.SMTP_HOST,
  secure: true,
  auth: {
    user: envVars.EMAIL_SENDER.SMTP_USER,
    pass: envVars.EMAIL_SENDER.SMTP_PASSWORD,
  },
  port: parseInt(envVars.EMAIL_SENDER.SMTP_PORT),
});

const escapeHtml = (value: unknown) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const renderOtpTemplate = (data: Record<string, any>) => {
  const name = escapeHtml(data.name ?? "User");
  const otp = escapeHtml(data.otp ?? "");

  return `<!DOCTYPE html>
<html>
  <body style="font-family: Arial, sans-serif; background:#f6f8fb; padding:24px;">
    <div style="max-width:480px;margin:auto;background:#ffffff;border-radius:8px;padding:24px;">
      <h2 style="margin:0 0 16px;color:#111;">Hello ${name},</h2>
      <p style="color:#333;">Use the verification code below. It expires in 2 minutes.</p>
      <div style="font-size:28px;font-weight:bold;letter-spacing:6px;background:#f1f5f9;padding:16px;border-radius:6px;text-align:center;color:#0f172a;">${otp}</div>
      <p style="color:#666;font-size:13px;margin-top:16px;">If you didn't request this, you can ignore this email.</p>
    </div>
  </body>
</html>`;
};

const templateRegistry: Record<string, (data: Record<string, any>) => string> = {
  otp: renderOtpTemplate,
};

export interface sendEmailOptions {
  to: string;
  subject: string;
  templateName: string;
  templateData: Record<string, any>;
  attachments?: {
    fileName: string;
    context: Buffer | string;
    contentType: string;
  }[];
}

export const sendEmail = async ({
  subject,
  templateData,
  templateName,
  to,
  attachments,
}: sendEmailOptions) => {
  try {
    const renderer = templateRegistry[templateName];

    if (!renderer) {
      throw new AppError(
        status.INTERNAL_SERVER_ERROR,
        `Unknown email template: ${templateName}`
      );
    }

    const html = renderer(templateData);

    const info = await transporter.sendMail({
      from: envVars.EMAIL_SENDER.SMTP_FROM,
      to,
      subject,
      html,
      attachments: attachments?.map((attachment) => ({
        filename: attachment.fileName,
        content: attachment.contentType,
        contentType: attachment.contentType,
      })),
    });

    console.log(`email sent ${to}: ${info.messageId} `);
  } catch (err: any) {
    console.log("email sending error", err.message);
    throw new AppError(status.INTERNAL_SERVER_ERROR, "failed to send");
  }
};