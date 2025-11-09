 // contactSchema.js
// Mongoose schema for Contact / Lead submissions (USA Autism ABA Clinic)

import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    // 🧩 Parent / Guardian Info
    parentName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },

    // 👶 Child / Client Info
    childName: {
      type: String,
      trim: true,
    },
    childAge: {
      type: Number,
      min: 0,
      max: 25,
    },

    // 📍 Location Info (important for U.S. clinics)
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    zipCode: {
      type: String,
      trim: true,
    },

    // 💬 Inquiry Details
    message: {
      type: String,
      required: true,
      trim: true,
    },
    serviceInterest: {
      type: String,
      enum: [
        "ABA Therapy",
        "Speech Therapy",
        "Occupational Therapy",
        "Behavioral Consultation",
        "Other",
      ],
      default: "ABA Therapy",
    },

    preferredContact: {
      type: String,
      enum: ["Call", "Email", "Text", "WhatsApp"],
      default: "Call",
    },

    bestTimeToReach: {
      type: String,
      trim: true,
    },

    // 📊 Marketing & Source Tracking
    leadSource: {
      type: String,
      enum: ["Website", "Google Ads", "Facebook", "Referral", "Other"],
      default: "Website",
    },
    utm: {
      campaign: String,
      medium: String,
      source: String,
    },

    // 🧠 Internal Use (admin / therapist)
    assignedStaff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["new", "contacted", "in-progress", "closed"],
      default: "new",
    },

    // 🔐 Security & Logging
    ipAddress: String,
    userAgent: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.ContactLead ||
  mongoose.model("ContactLead", contactSchema);
