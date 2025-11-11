import multer from "multer";
import fs from "fs";
import path from "path";

// Define the uploads directory
const uploadDir = path.join(process.cwd(), "uploads/resumes");

// Ensure the folder exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("✅ Created uploads/resumes folder");
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const uniqueSuffix = Math.round(Math.random() * 1e9);
    const cleanName = file.originalname.replace(/\s+/g, "_");
    cb(null, `${timestamp}-${uniqueSuffix}-${cleanName}`);
  },
});

// File filter (accept only docs and pdf)
const fileFilter = (req, file, cb) => {
  const allowed = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only PDF or DOC/DOCX allowed."), false);
  }
};

// Final multer upload instance
const uploadResume = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

export default uploadResume;
