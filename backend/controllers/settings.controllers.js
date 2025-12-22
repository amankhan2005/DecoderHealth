 import Settings from "../models/global.models.js";

async function ensureSettings() {
  let s = await Settings.findOne();
  if (!s) {
    s = await Settings.create({
      global: {
        logo: "",
        phone: "",
        email: "",
        address: "",
        facebook: "",
        instagram: "",
        twitter: "",
        tiktok: "",
        youtube: "" // ✅ ADDED
      },
      globalMeta: {
        logoUpdatedAt: null,
        phoneUpdatedAt: null,
        emailUpdatedAt: null,
        addressUpdatedAt: null,
        facebookUpdatedAt: null,
        instagramUpdatedAt: null,
        twitterUpdatedAt: null,
        tiktokUpdatedAt: null,
        youtubeUpdatedAt: null // ✅ ADDED
      }
    });
  }
  return s;
}

export const getSettings = async (req, res) => {
  try {
    const s = await ensureSettings();
    res.json(s);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Update settings with per-field toggles
 */
export const updateSettings = async (req, res) => {
  try {
    const user = req.headers["x-admin-user"];
    const pass = req.headers["x-admin-pass"];

    if (user !== process.env.ADMIN_USER || pass !== process.env.ADMIN_PASS) {
      return res.status(403).json({ error: "Invalid admin credentials" });
    }

    const s = await ensureSettings();

    // ✅ allowed fields (YouTube added)
    const allowed = [
      "logo",
      "phone",
      "email",
      "address",
      "facebook",
      "instagram",
      "twitter",
      "tiktok",
      "youtube" // ✅ ADDED
    ];

    let fieldsToUpdate = req.body.fieldsToUpdate;
    if (typeof fieldsToUpdate === "string") {
      try {
        fieldsToUpdate = JSON.parse(fieldsToUpdate);
      } catch {
        fieldsToUpdate = fieldsToUpdate
          .split(",")
          .map(f => f.trim())
          .filter(Boolean);
      }
    }

    const doSelective =
      Array.isArray(fieldsToUpdate) && fieldsToUpdate.length > 0;

    const now = new Date();

    const setField = (field, value) => {
      s.global[field] = value;
      if (!s.globalMeta) s.globalMeta = {};
      s.globalMeta[`${field}UpdatedAt`] = now;
    };

    // 🔹 Logo upload
    if (req.file) {
      if (!doSelective || fieldsToUpdate.includes("logo")) {
        s.global.logo = `/uploads/settings/${req.file.filename}`;
        if (!s.globalMeta) s.globalMeta = {};
        s.globalMeta.logoUpdatedAt = now;
      }
    }

    // 🔹 Other fields
    for (const key of allowed) {
      if (key === "logo") continue;

      const incoming = req.body[key];
      if (typeof incoming === "undefined") continue;
      if (doSelective && !fieldsToUpdate.includes(key)) continue;

      setField(key, incoming);
    }

    await s.save();

    res.json({ ok: true, settings: s });
  } catch (err) {
    console.error("settings.update error:", err);
    res.status(500).json({ error: err.message });
  }
};
