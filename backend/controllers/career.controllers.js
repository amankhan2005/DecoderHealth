 import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";
import fs from "fs";

/* ------------------ EMAIL CONFIG ------------------ */
if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_EMAIL_PASSWORD) {
  console.error("❌ Missing Gmail credentials. Please set ADMIN_EMAIL and ADMIN_EMAIL_PASSWORD in .env");
  throw new Error("Email configuration missing");
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  pool: true,
  maxConnections: 5,
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_EMAIL_PASSWORD,
  },
  tls: { rejectUnauthorized: false },
});

/* ------------------ VALIDATORS ------------------ */
const isValidEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s || "").trim());
const isValidPhone = (s) => /^[0-9]{7,15}$/.test(String(s || "").trim());

/* ------------------ EMAIL TEMPLATES ------------------ */
const emailWrapper = (content) => `
  <div style="background:#f9fafb;padding:40px 0;font-family:'Segoe UI',Arial,sans-serif;">
    <table align="center" width="600" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 6px 20px rgba(0,0,0,0.08);">
      <tr>
        <td style="background:#ff7f00;padding:16px 32px;text-align:center;">
          <h2 style="color:#fff;margin:0;font-size:22px;letter-spacing:0.5px;">Autism ABA Partners</h2>
        </td>
      </tr>
      <tr>
        <td style="padding:32px 40px;">
          ${content}
        </td>
      </tr>
      <tr>
        <td style="background:#f3f4f6;padding:16px 32px;text-align:center;color:#6b7280;font-size:13px;">
          &copy; ${new Date().getFullYear()} Autism ABA Partners. All rights reserved.<br/>
          <span>849 Fairmount Ave, Suite 200-T8, Towson, MD 21286</span>
        </td>
      </tr>
    </table>
  </div>
`;

const adminEmailTemplate = (data) =>
  emailWrapper(`
    <h3 style="color:#111827;margin-bottom:12px;">📩 New Career Application Received</h3>
    <p style="color:#374151;font-size:15px;">A new applicant has submitted their career form on the website. Details are below:</p>
    <table style="width:100%;margin-top:16px;border-collapse:collapse;">
      <tr><td style="padding:8px 0;color:#111827;"><strong>Full Name:</strong></td><td>${data.fullName}</td></tr>
      <tr><td style="padding:8px 0;color:#111827;"><strong>Email:</strong></td><td>${data.email}</td></tr>
      <tr><td style="padding:8px 0;color:#111827;"><strong>Phone:</strong></td><td>${data.phone}</td></tr>
      <tr><td style="padding:8px 0;color:#111827;"><strong>City:</strong></td><td>${data.city || "-"}</td></tr>
      <tr><td style="padding:8px 0;color:#111827;"><strong>State:</strong></td><td>${data.state || "-"}</td></tr>
      <tr><td style="padding:8px 0;color:#111827;"><strong>Zip Code:</strong></td><td>${data.zip || "-"}</td></tr>
      <tr><td style="padding:8px 0;color:#111827;"><strong>Credentialing Status:</strong></td><td>${data.credential}</td></tr>
      <tr><td style="padding:8px 0;color:#111827;"><strong>Interested In:</strong></td><td>${data.interested}</td></tr>
    </table>
    <p style="margin-top:24px;font-size:14px;color:#6b7280;">Submitted on: 
      <strong>${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</strong>
    </p>
  `);

const applicantEmailTemplate = (data) =>
  emailWrapper(`
    <h3 style="color:#111827;margin-bottom:12px;">Thank You for Applying, ${data.fullName}!</h3>
    <p style="color:#374151;font-size:15px;line-height:1.6;">
      We’ve received your application at <strong>Autism ABA Partners</strong>.
      Our HR team will review your details and contact you soon if you’re shortlisted.
    </p>
    <div style="background:#fff4e6;border-left:4px solid #ff7f00;padding:12px 16px;margin-top:20px;border-radius:8px;">
      <p style="margin:0;color:#7c2d12;font-size:14px;">
        Please ensure your contact details are correct. You may also reply to this email for follow-up queries.
      </p>
    </div>
    <p style="margin-top:24px;color:#6b7280;font-size:14px;">Warm regards,<br/><strong>Autism ABA Partners HR Team</strong></p>
  `);

/* ------------------ MAIN CONTROLLER ------------------ */
export const applyCareerForm = async (req, res) => {
  try {
    const { fullName, email, phone, zip, city, state, credential, interested } = req.body;
    const file = req.file;

    if (!fullName || !email || !phone)
      return res.status(400).json({ message: "Full name, email, and phone are required." });

    if (!isValidEmail(email))
      return res.status(400).json({ message: "Invalid email format." });

    if (!isValidPhone(phone))
      return res.status(400).json({ message: "Invalid phone number." });

    if (!file)
      return res.status(400).json({ message: "Resume file is required." });

    // ✅ Instant frontend response
    res.status(200).json({ success: true, message: "Application submitted successfully." });

    // ✅ Multiple HR/receiver emails supported (comma-separated)
    const hrRecipients = (process.env.RECEIVER_EMAIL || process.env.ADMIN_EMAIL)
      .split(",")
      .map((e) => e.trim());

    // ✅ Prepare admin mail
    const adminMail = {
      from: `"Autism ABA Partners" <${process.env.ADMIN_EMAIL}>`,
      to: hrRecipients,
      cc: process.env.ADMIN_EMAIL, // send a copy to admin account
      subject: `New Application - ${fullName}`,
      html: adminEmailTemplate({ fullName, email, phone, zip, city, state, credential, interested }),
      attachments: [{ filename: file.originalname, path: file.path }],
    };

    // ✅ Applicant mail
    const applicantMail = {
      from: `"Autism ABA Partners" <${process.env.ADMIN_EMAIL}>`,
      to: email,
      subject: "We’ve received your application!",
      html: applicantEmailTemplate({ fullName }),
    };

    console.log("📨 Sending Admin Email To:", hrRecipients.join(", "));
    console.log("📬 Sending Applicant Email To:", email);

    // 🚀 Send both emails in background (parallel)
    Promise.all([
      transporter.sendMail(adminMail).then(() => console.log("✅ Admin mail sent")),
      transporter.sendMail(applicantMail).then(() => console.log("✅ Applicant mail sent")),
    ])
      .then(() => {
        if (file?.path && fs.existsSync(file.path)) {
          fs.unlink(file.path, (err) =>
            err
              ? console.error("⚠️ Resume cleanup error:", err)
              : console.log("🗑️ Deleted uploaded resume:", file.path)
          );
        }
      })
      .catch((err) => console.error("⚠️ Email send error:", err.message));

  } catch (error) {
    console.error("Career form error:", error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: "Failed to send application.", error: error.message });
    }
  }
};
