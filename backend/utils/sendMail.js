 // utils/sendMail.js
import nodemailer from "nodemailer";

const createTransporter = () => {
  const user = process.env.ADMIN_EMAIL?.trim();
  let pass = process.env.ADMIN_EMAIL_PASSWORD?.trim();

  if (!user || !pass) {
    console.error("❌ Missing Gmail credentials in .env");
    return null;
  }

  // Remove accidental spaces from Gmail App Password
  if (/\s/.test(pass)) pass = pass.replace(/\s+/g, "");

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // SSL
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
  });

  transporter.verify((err) => {
    if (err) console.error("❌ Gmail Verify Error:", err.message);
    else console.log("✅ Gmail Transporter Ready");
  });

  return transporter;
};

export const sendMail = async ({ to, subject, html, text }) => {
  try {
    const transporter = createTransporter();
    if (!transporter) throw new Error("Transporter not initialized");

    const info = await transporter.sendMail({
      from: `"Autism ABA Partners" <${process.env.ADMIN_EMAIL}>`,
      to,
      subject,
      html,
      text: text || "",
    });

    console.log("✅ Mail sent:", info.response);
    return info;
  } catch (err) {
    console.error("❌ Mail send error:", err.message);
    throw err;
  }
};
