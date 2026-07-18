"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = sendEmail;
exports.sendWelcomeEmail = sendWelcomeEmail;
exports.sendApplicationSubmittedEmail = sendApplicationSubmittedEmail;
exports.sendApplicationStatusEmail = sendApplicationStatusEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = require("../config/env");
const logger_1 = require("../utils/logger");
const hasSmtp = Boolean(env_1.env.SMTP_HOST && env_1.env.SMTP_USER && env_1.env.SMTP_PASS);
const transporter = hasSmtp
    ? nodemailer_1.default.createTransport({
        host: env_1.env.SMTP_HOST,
        port: env_1.env.SMTP_PORT,
        secure: env_1.env.SMTP_PORT === 465,
        auth: {
            user: env_1.env.SMTP_USER,
            pass: env_1.env.SMTP_PASS,
        },
    })
    : null;
async function sendEmail(options) {
    if (!transporter) {
        logger_1.logger.warn("SMTP not configured — email skipped", {
            to: options.to,
            subject: options.subject,
        });
        return false;
    }
    try {
        await transporter.sendMail({
            from: env_1.env.EMAIL_FROM,
            to: options.to,
            subject: options.subject,
            html: options.html,
            text: options.text,
        });
        return true;
    }
    catch (error) {
        logger_1.logger.error("Failed to send email", error);
        return false;
    }
}
function wrapTemplate(title, body) {
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
async function sendWelcomeEmail(name, email) {
    await sendEmail({
        to: email,
        subject: "Welcome to HireGenius AI",
        html: wrapTemplate("Welcome aboard", `<p>Hi ${name},</p><p>Your HireGenius AI account is ready. Explore AI-powered job matching, resume tools, and career coaching.</p>`),
    });
}
async function sendApplicationSubmittedEmail(candidateName, email, jobTitle, companyName) {
    await sendEmail({
        to: email,
        subject: `Application submitted — ${jobTitle}`,
        html: wrapTemplate("Application received", `<p>Hi ${candidateName},</p><p>Your application for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> was submitted successfully.</p>`),
    });
}
async function sendApplicationStatusEmail(candidateName, email, jobTitle, status) {
    await sendEmail({
        to: email,
        subject: `Application update — ${jobTitle}`,
        html: wrapTemplate("Application status updated", `<p>Hi ${candidateName},</p><p>Your application for <strong>${jobTitle}</strong> is now: <strong>${status}</strong>.</p>`),
    });
}
//# sourceMappingURL=email.service.js.map