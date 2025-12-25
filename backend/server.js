 // server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import path from "path";

import contactRoutes from "./routes/contact.routes.js";
import careerRoutes from "./routes/career.routes.js";
import dashboard from "./routes/dashboard.routes.js";
import settingsRoutes from "./routes/settings.routes.js";
import maproutes from "./routes/map.routes.js"
import heroroutes from "./routes/hero.routes.js"
 
dotenv.config();

const app = express();

// trust proxy for correct client IPs (heroku, nginx, etc.)
app.set("trust proxy", 1);

// ---------------------- SECURITY & LOGGING ----------------------
// Helmet with explicit Cross-Origin-Resource-Policy set to allow images from frontend
app.use(
  helmet({
    // allow browser to load images served by our /uploads route from a different origin
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// basic rate limiter
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100,
});
app.use(limiter);

// ---------------------- CORS SETUP ----------------------
// Allowed origins list (add more domains via ALLOWED_ORIGINS env comma-separated)
 const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",

  "https://decoderhealth.netlify.app",
  "https://decoderhealthaba.netlify.app",

  "https://decoderhealth.com",
  "https://www.decoderhealth.com",

  ...(process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",").map((u) => u.trim())
    : []),
].filter(Boolean);


/**
 * CORS middleware:
 * - allows specified origins
 * - allows custom headers used by admin (x-admin-user, x-admin-pass)
 * - allows server-to-server requests (no origin)
 */
app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (e.g. curl, mobile apps, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      console.warn(`❌ CORS blocked request from: ${origin}`);
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    // include your custom admin headers here so preflight allows them
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
      "Referer",
      "Cache-Control",
      "x-admin-user",
      "x-admin-pass",
      "x-admin-token",
    ],
    // optional headers to expose to browser
    exposedHeaders: ["Content-Length", "X-Kortman-Info"],
    credentials: true,
    optionsSuccessStatus: 204,
    preflightContinue: false,
  })
);

// Ensure preflight OPTIONS are handled for all routes
app.options("*", cors());

// debug preflight (optional; only noisy in development)
app.use((req, res, next) => {
  if (process.env.NODE_ENV !== "production" && req.method === "OPTIONS") {
    console.log("🚦 OPTIONS preflight:", {
      origin: req.headers.origin,
      path: req.path,
      reqHeaders: req.headers["access-control-request-headers"],
    });
  }
  next();
});

// body parser
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

// ---------------------- STATIC UPLOADS (serve user-uploaded files) ----------------------
// Important: set Cross-Origin-Resource-Policy header so browsers can load images from other origin
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"), {
    setHeaders: (res) => {
      // allow cross-origin resource access for images served from /uploads
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    },
  })
);

// ---------------------- ROUTES ----------------------
app.use("/api/contact", contactRoutes);
app.use("/api/career", careerRoutes);
app.use("/api/dashboard", dashboard);
app.use("/api/settings", settingsRoutes);
app.use("/api/map",maproutes);
app.use("/api/hero",heroroutes);
 
// simple health check
app.get("/", (req, res) => {
  res.json({
    ok: true,
    service: "Decoder Health API",
    env: process.env.NODE_ENV || "development",
    db: process.env.DISABLE_DB === "true" ? "disabled" : "enabled",
    allowedOrigins,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Not Found" });
});

// global error handler
app.use((err, req, res, next) => {
  // Log the full error object to help debug on server
  console.error("Unhandled Error:", err);
  if (err && err.message && err.message.toLowerCase().includes("cors")) {
    return res.status(403).json({ ok: false, message: "CORS policy: origin not allowed" });
  }
  const status = err?.status || 500;
  res.status(status).json({ ok: false, message: err?.message || "Internal Server Error" });
});

// ----------------- DB + SERVER STARTUP -----------------
const disableDb = process.env.DISABLE_DB === "true";
const MONGO_URI = process.env.MONGO_URI;
let server;

async function startServer() {
  try {
    if (!disableDb) {
      if (!MONGO_URI) {
        console.error("❌ MONGO_URI is not set in environment variables.");
        process.exit(1);
      }

      // optional mongoose settings
      mongoose.set("strictQuery", false);

      console.log("Connecting to MongoDB...");
      await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log("✅ MongoDB connected");
    } else {
      console.log("⚠️ MongoDB connection disabled via DISABLE_DB=true");
    }

    const PORT = process.env.PORT || 5000;
    server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log("🌐 Allowed Origins:", allowedOrigins);
    });
  } catch (err) {
    console.error("❌ Startup error:", err);
    // If DB is required (not disabled) and failed, exit with code 1 to surface in hosting logs
    if (!disableDb) {
      process.exit(1);
    } else {
      const PORT = process.env.PORT || 5000;
      server = app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT} (DB disabled)`);
      });
    }
  }
}
startServer();

// ----------------- Graceful shutdown -----------------
const gracefulShutdown = async (signal) => {
  console.log(`Received ${signal}. Shutting down gracefully...`);
  try {
    if (server) {
      server.close(() => {
        console.log("HTTP server closed.");
      });
    }

    if (!disableDb && mongoose.connection && mongoose.connection.readyState === 1) {
      await mongoose.connection.close(false);
      console.log("Mongo connection closed.");
    }

    process.exit(0);
  } catch (err) {
    console.error("Error during shutdown:", err);
    process.exit(1);
  }
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

// handle uncaught errors
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
  // optionally exit or keep running depending on your policy
});
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  // optionally exit or keep running depending on your policy
});
