import nodemailer from "nodemailer";
import { env } from "../config/env";
import { logger } from "../utils/logger";

const hasSmtp = Boolean(env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS);

const transporter = hasSmtp
  ? nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    })
  : null;

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: SendEmailOptions): Promise<boolean> {
  if (!transporter) {
    logger.warn("SMTP not configured — email skipped", {
      to: options.to,
      subject: options.subject,
    });
    return false;
  }

  try {
    await transporter.sendMail({
      from: env.EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });
    return true;
  } catch (error) {
    logger.error("Failed to send email", error);
    return false;
  }
}

function wrapTemplate(title: string, body: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/><title>${title}</title></head>
<body style="margin:0;padding:0;background:#0B0F19;font-family:Inter,Arial,sans-serif;color:#E5E7EB;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr><td align="center">
      <table width="560" style="background:#111827;border-radius:20px;padding:32px;border:1px solid #1F2937;">
        <tr><td>
          <h1 style="margin:0 0 8px;font-size:22px;color:#A78BFA;">HireGenius AI</h1>
          <h2 style="margin:0 0 16px;font-size:18px;color:#F9FAFB;">${title}</h2>
          <div style="font-size:14px;line-height:1.6;color:#D1D5DB;">${body}</div>
          <p style="margin-top:24px;font-size:12px;color:#6B7280;">© ${new Date().getFullYear()} HireGenius AI</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function sendWelcomeEmail(name: string, email: string): Promise<void> {
  await sendEmail({
    to: email,
    subject: "Welcome to HireGenius AI",
    html: wrapTemplate(
      "Welcome aboard",
      `<p>Hi ${name},</p><p>Your HireGenius AI account is ready. Explore AI-powered job matching, resume tools, and career coaching.</p>`
    ),
  });
}

export async function sendApplicationSubmittedEmail(
  candidateName: string,
  email: string,
  jobTitle: string,
  companyName: string
): Promise<void> {
  await sendEmail({
    to: email,
    subject: `Application submitted — ${jobTitle}`,
    html: wrapTemplate(
      "Application received",
      `<p>Hi ${candidateName},</p><p>Your application for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> was submitted successfully.</p>`
    ),
  });
}

export async function sendApplicationStatusEmail(
  candidateName: string,
  email: string,
  jobTitle: string,
  status: string
): Promise<void> {
  await sendEmail({
    to: email,
    subject: `Application update — ${jobTitle}`,
    html: wrapTemplate(
      "Application status updated",
      `<p>Hi ${candidateName},</p><p>Your application for <strong>${jobTitle}</strong> is now: <strong>${status}</strong>.</p>`
    ),
  });
}
