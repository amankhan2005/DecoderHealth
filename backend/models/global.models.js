 import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  global: {
    logo: { type: String, default: "" },   // multer file path

    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    address: { type: String, default: "" },

    // ⭐ SOCIAL LINKS (only these)
    facebook: { type: String, default: "" },
    instagram: { type: String, default: "" },
    twitter: { type: String, default: "" },  // X.com
    tiktok: { type: String, default: "" },
    youtube: { type: String, default: "" }
  }
}, { timestamps: true });

export default mongoose.models.Settings ||
  mongoose.model("Settings", settingsSchema);
