 // controllers/contact.controller.js
// Autism ABA Partners - contact controller (clean admin + premium user emails)

import nodemailer from "nodemailer";
import ContactLead from "../models/contact.models.js"; // kept for other controllers (list/delete/getById)

// Utility functions
function missingFields(body, fields) {
  return fields.filter((f) => !body[f] && body[f] !== 0);
}

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Create transporter
function createTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.ADMIN_EMAIL,
      pass: process.env.ADMIN_EMAIL_PASSWORD,
    },
    tls: { rejectUnauthorized: false },
  });
}

// --------------------------- MAIN HANDLER ---------------------------
export const createInquiry = async (req, res) => {
  const {
    parentName,
    email,
    phone,
    childName,
    childAge,
    city,
    state,
    zipCode,
    message,
    serviceInterest,
    preferredContact,
    bestTimeToReach,
    leadSource,
    utm,
  } = req.body;

  const required = ["parentName", "email", "phone", "message"];
  const missing = missingFields(req.body, required);
  if (missing.length > 0)
    return res.status(400).json({
      ok: false,
      message: `Missing required fields: ${missing.join(", ")}`,
    });

  try {
    // ----------------- NOTE -----------------
    // MongoDB save removed here intentionally.
    // We build a `saved` object in-memory (not persisted) and use it below for emails & response.
    // ----------------------------------------

    const saved = {
      parentName: parentName?.trim() || "",
      email: String(email).trim().toLowerCase(),
      phone: String(phone).trim(),
      childName: childName?.trim() || "",
      childAge:
        childAge !== undefined && childAge !== "" ? Number(childAge) : undefined,
      city: city?.trim() || "",
      state: state?.trim() || "",
      zipCode: zipCode?.trim() || "",
      message: String(message).trim(),
      serviceInterest: serviceInterest || "",
      preferredContact: preferredContact || "",
      bestTimeToReach: bestTimeToReach || "",
      leadSource: leadSource || "",
      utm: typeof utm === "object" ? utm : undefined,
      ipAddress: req.ip || req.headers["x-forwarded-for"] || "",
      userAgent: req.get("User-Agent") || "",
      createdAt: new Date(),
    };

    // ---------------- EMAIL SETUP ----------------
    const transporter = createTransporter();

    // ---------- 1️⃣ ADMIN EMAIL (CLEAN + SIMPLE) ----------
    const adminSubject = `New Inquiry — ${saved.parentName}`;
    const adminText = `
Autism ABA Partners — New Inquiry

Parent/Guardian: ${saved.parentName}
Email: ${saved.email}
Phone: ${saved.phone}

Child: ${saved.childName || "N/A"} (Age: ${
      typeof saved.childAge !== "undefined" ? saved.childAge : "N/A"
    })
Service Interest: ${saved.serviceInterest || "N/A"}
Preferred Contact: ${saved.preferredContact || "N/A"}
Best Time: ${saved.bestTimeToReach || "N/A"}

Location: ${
      [saved.city, saved.state, saved.zipCode].filter(Boolean).join(", ") ||
      "N/A"
    }

Message:
${saved.message}

Source: ${saved.leadSource || "N/A"}
IP: ${saved.ipAddress || "N/A"}
User Agent: ${saved.userAgent || "N/A"}

-- Autism ABA Partners Website
`.trim();

    const adminHtml = `
<html>
  <body style="font-family: Arial, sans-serif; background:#ffffff; color:#1e293b; margin:0; padding:20px;">
    <h2 style="color:#ff7a00; margin-bottom:8px;">Autism ABA Partners — New Inquiry</h2>
    <p style="margin:4px 0;"><strong>Parent/Guardian:</strong> ${escapeHtml(
      saved.parentName
    )}</p>
    <p style="margin:4px 0;"><strong>Email:</strong> <a href="mailto:${escapeHtml(
      saved.email
    )}" style="color:#0f5132;">${escapeHtml(saved.email)}</a></p>
    <p style="margin:4px 0;"><strong>Phone:</strong> ${escapeHtml(saved.phone)}</p>
    <p style="margin:4px 0;"><strong>Child:</strong> ${escapeHtml(
      saved.childName || "N/A"
    )} (Age: ${
      typeof saved.childAge !== "undefined"
        ? escapeHtml(String(saved.childAge))
        : "N/A"
    })</p>
    <p style="margin:4px 0;"><strong>Service Interest:</strong> ${escapeHtml(
      saved.serviceInterest || "N/A"
    )}</p>
    <p style="margin:4px 0;"><strong>Preferred Contact:</strong> ${escapeHtml(
      saved.preferredContact || "N/A"
    )}</p>
    <p style="margin:4px 0;"><strong>Best Time:</strong> ${escapeHtml(
      saved.bestTimeToReach || "N/A"
    )}</p>
    <p style="margin:4px 0;"><strong>Location:</strong> ${escapeHtml(
      [saved.city, saved.state, saved.zipCode].filter(Boolean).join(", ") ||
        "N/A"
    )}</p>
    <p style="margin-top:10px;"><strong>Message:</strong><br><span style="white-space:pre-wrap;">${escapeHtml(
      saved.message
    )}</span></p>
    <hr style="margin:20px 0; border:none; border-top:1px solid #e2e8f0;">
    <p style="font-size:13px; color:#64748b;">
      Source: ${escapeHtml(saved.leadSource || "N/A")}<br>
      IP: ${escapeHtml(saved.ipAddress || "N/A")}<br>
      UA: ${escapeHtml(saved.userAgent || "N/A")}
    </p>
    <p style="margin-top:20px; font-size:12px; color:#64748b;">Autism ABA Partners • info@autismabapartners.com</p>
  </body>
</html>
`.trim();

    // ---------- 2️⃣ USER "THANK YOU" EMAIL ----------
    const userSubject = `Thank You — Autism ABA Partners`;
    const userText = `
Hello ${saved.parentName},

Thank you for reaching out to Autism ABA Partners!
We’ve received your message and our team will contact you within 24 hours.

Summary:
Service Interest: ${saved.serviceInterest || "N/A"}
Message: ${saved.message}

If this is urgent, you can reply directly to this email.

— Autism ABA Partners
info@autismabapartners.com
`.trim();

    const userHtml = `
<html>
  <body style="font-family: Arial, sans-serif; background:#fafaf9; color:#1e293b; margin:0; padding:24px;">
    <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:8px; box-shadow:0 6px 18px rgba(0,0,0,0.06); overflow:hidden;">
      <div style="padding:16px 20px; background:#ff7a00;">
        <h2 style="margin:0; color:#ffffff;">Thank You for Contacting Us</h2>
      </div>
      <div style="padding:20px;">
        <p>Hi ${escapeHtml(saved.parentName)},</p>
        <p>Thank you for reaching out to <strong>Autism ABA Partners</strong>. We’ve received your message and will contact you within 24 hours.</p>

        <div style="margin:16px 0; padding:12px; background:#f8faf8; border-radius:6px; border:1px solid #e2e8f0;">
          <strong>Summary</strong><br>
          <span>Service Interest: ${escapeHtml(saved.serviceInterest || "N/A")}</span><br>
          <span>Message:</span>
          <div style="margin-top:6px; white-space:pre-wrap;">${escapeHtml(
            saved.message
          )}</div>
        </div>

        <p>If your matter is urgent, reply to this email directly.</p>
        <p style="margin-top:16px; color:#64748b; font-size:14px;">Warm regards,<br>Autism ABA Partners</p>
      </div>
      <div style="padding:14px 20px; background:#f9fafb; text-align:center; font-size:13px; color:#64748b;">
        info@autismabapartners.com
      </div>
    </div>
  </body>
</html>
`.trim();

    // ---------- Send both ----------
    transporter.sendMail(
      {
        from: `"Autism ABA Partners" <${process.env.ADMIN_EMAIL}>`,
        to: process.env.ADMIN_EMAIL,
        subject: adminSubject,
        text: adminText,
        html: adminHtml,
      },
      (err, info) => {
        if (err) console.error("Admin mail error:", err);
        else console.log("Admin mail sent:", info?.response || info);
      }
    );

    transporter.sendMail(
      {
        from: `"Autism ABA Partners" <${process.env.ADMIN_EMAIL}>`,
        to: saved.email,
        subject: userSubject,
        text: userText,
        html: userHtml,
      },
      (err, info) => {
        if (err) console.error("User mail error:", err);
        else console.log("User mail sent:", info?.response || info);
      }
    );

    return res.status(201).json({
      ok: true,
      message: "Inquiry processed successfully (not saved to DB)",
      contact: saved,
    });
  } catch (error) {
    console.error("Error creating inquiry:", error);
    return res.status(500).json({
      ok: false,
      message: "Error creating inquiry",
      error: error?.message || error,
    });
  }
};

// ------------------- OTHER CONTROLLERS -------------------

export const getAllInquiry = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.leadSource) filter.leadSource = req.query.leadSource;

    const inquiries = await ContactLead.find(filter)
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return res.status(200).json({
      ok: true,
      count: inquiries.length,
      inquiries,
    });
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    return res.status(500).json({
      ok: false,
      message: "Error fetching inquiries",
      error,
    });
  }
};

export const deleteInquiry = async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res.status(400).json({ ok: false, message: "Missing id parameter" });

  try {
    const deleted = await ContactLead.findByIdAndDelete(id).exec();
    if (!deleted)
      return res.status(404).json({ ok: false, message: "Inquiry not found" });

    return res
      .status(200)
      .json({ ok: true, message: "Inquiry deleted successfully", id });
  } catch (error) {
    console.error("Error deleting inquiry:", error);
    return res.status(500).json({
      ok: false,
      message: "Error deleting inquiry",
      error,
    });
  }
};

export const getInquiryById = async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res.status(400).json({ ok: false, message: "Missing id parameter" });

  try {
    const doc = await ContactLead.findById(id).lean().exec();
    if (!doc)
      return res.status(404).json({ ok: false, message: "Inquiry not found" });

    return res.status(200).json({ ok: true, inquiry: doc });
  } catch (error) {
    console.error("Error fetching inquiry:", error);
    return res.status(500).json({
      ok: false,
      message: "Error fetching inquiry",
      error,
    });
  }
};
