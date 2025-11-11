 // controllers/contact.controller.js
import ContactLead from "../models/contact.models.js";
import { sendMail } from "../utils/sendMail.js";

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

    // ---------- Admin Mail ----------
    const adminSubject = `New Inquiry — ${saved.parentName}`;
    const adminHtml = `
      <h2 style="color:#ff7a00;">New Inquiry - Autism ABA Partners</h2>
      <p><b>Parent/Guardian:</b> ${escapeHtml(saved.parentName)}</p>
      <p><b>Email:</b> ${escapeHtml(saved.email)}</p>
      <p><b>Phone:</b> ${escapeHtml(saved.phone)}</p>
      <p><b>Child:</b> ${escapeHtml(saved.childName || "N/A")} (Age: ${
      typeof saved.childAge !== "undefined" ? escapeHtml(String(saved.childAge)) : "N/A"
    })</p>
      <p><b>Service Interest:</b> ${escapeHtml(saved.serviceInterest || "N/A")}</p>
      <p><b>Message:</b><br>${escapeHtml(saved.message)}</p>
      <p><b>City/State:</b> ${escapeHtml([saved.city, saved.state].filter(Boolean).join(", "))}</p>
      <hr>
      <p><small>IP: ${escapeHtml(saved.ipAddress || "N/A")} | UA: ${escapeHtml(saved.userAgent || "N/A")}</small></p>
    `;

    const adminText = `
New Inquiry
Parent: ${saved.parentName}
Email: ${saved.email}
Phone: ${saved.phone}
Message: ${saved.message}
    `.trim();

    // ---------- User Mail ----------
    const userSubject = `Thank You — Autism ABA Partners`;
    const userHtml = `
      <div style="font-family:Arial;padding:20px;background:#fff;">
        <h3 style="color:#ff7a00;">Thank You for Contacting Us</h3>
        <p>Hi ${escapeHtml(saved.parentName)},</p>
        <p>Thank you for reaching out to <strong>Autism ABA Partners</strong>. We’ve received your message and will contact you within 24 hours.</p>
        <div style="margin-top:10px;padding:10px;background:#f8f9fa;border-radius:6px;">
          <strong>Your Message:</strong><br>${escapeHtml(saved.message)}
        </div>
        <p style="margin-top:15px;font-size:13px;color:#666;">info@autismabapartners.com</p>
      </div>
    `;

    const userText = `
Hello ${saved.parentName},
Thanks for contacting Autism ABA Partners. We’ll get back to you soon!
    `.trim();

    // ---------- Send both concurrently ----------
    await Promise.all([
      sendMail({
        to: process.env.ADMIN_EMAIL,
        subject: adminSubject,
        html: adminHtml,
        text: adminText,
      }),
      sendMail({
        to: saved.email,
        subject: userSubject,
        html: userHtml,
        text: userText,
      }),
    ]);

    return res.status(201).json({
      ok: true,
      message: "Inquiry processed successfully (emails sent)",
      contact: saved,
    });
  } catch (error) {
    console.error("❌ Error creating inquiry:", error);
    return res.status(500).json({
      ok: false,
      message: "Error sending inquiry email",
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
