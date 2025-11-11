 import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import contactRoutes from './routes/contact.routes.js';
import careerRoutes from './routes/career.routes.js'; // ✅ Added for Career Page uploads

// Load .env
dotenv.config();

const app = express();

// Trust proxy (important for production)
app.set('trust proxy', 1);

// Security headers
app.use(helmet());

// Logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Rate limiter (basic protection)
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// ---------------------- CORS SETUP ----------------------
const allowedOrigins = [
  'http://localhost:5173',
  'https://autismpartner.netlify.app',
  'https://autismabapartners.com', // ✅ your live domain
  'autismabapartners.com', // ✅ your live domain
  ...(process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map((u) => u.trim())
    : []),
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow mobile, curl, server requests
      if (allowedOrigins.includes(origin)) return callback(null, true);

      console.warn(`❌ CORS blocked request from: ${origin}`);
      return callback(null, false);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
      'Referer',
      'Cache-Control',
    ],
    credentials: true,
    optionsSuccessStatus: 204,
  })
);

// Ensure preflight OPTIONS requests are handled
app.options('*', cors());

// Debugging helper (can remove in prod)
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    console.log('🚦 OPTIONS preflight:', { origin: req.headers.origin, path: req.path });
  }
  next();
});

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// ----------------- Conditional MongoDB Connection -----------------
const disableDb = process.env.DISABLE_DB === 'true';
let mongoConnected = false;
const MONGO_URI = process.env.MONGO_URI;

if (disableDb) {
  console.log('⚠️  MongoDB connection disabled via DISABLE_DB=true');
} else {
  if (!MONGO_URI) {
    console.error('❌ MONGO_URI is not set in environment variables.');
    process.exit(1);
  }

  mongoose
    .connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      mongoConnected = true;
      console.log('✅ MongoDB connected');
    })
    .catch((err) => {
      console.error('❌ MongoDB connection error:', err);
      process.exit(1);
    });
}

// ----------------- STATIC UPLOADS -----------------
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// ----------------- ROUTES -----------------
app.use('/api/contact', contactRoutes);
app.use('/api/career', careerRoutes); // ✅ Added Career Page API

// Basic health-check route
app.get('/', (req, res) => {
  res.json({
    ok: true,
    service: 'Autism ABA Clinic API',
    env: process.env.NODE_ENV || 'development',
    db: disableDb ? 'disabled' : 'enabled',
    allowedOrigins,
  });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ ok: false, message: 'Not Found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err?.message || err);
  const status = err.status || 500;

  if (err && err.message && err.message.toLowerCase().includes('cors')) {
    return res.status(403).json({ ok: false, message: 'CORS policy: origin not allowed' });
  }

  res.status(status).json({
    ok: false,
    message: err.message || 'Internal Server Error',
  });
});

// ----------------- START SERVER -----------------
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log('🌐 Allowed Origins:', allowedOrigins);
});

// Graceful shutdown
const shutdown = async () => {
  console.log('Shutdown initiated...');
  server.close(async () => {
    console.log('HTTP server closed.');

    if (!disableDb && mongoConnected && mongoose.connection && mongoose.connection.readyState === 1) {
      mongoose.connection.close(false, () => {
        console.log('Mongo connection closed.');
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  });

  // Force exit after 10s
  setTimeout(() => {
    console.error('Forcing shutdown');
    process.exit(1);
  }, 10000);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
