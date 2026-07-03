const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();
app.set('trust proxy', 1);
app.use(helmet({ contentSecurityPolicy: false }));

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
  : ['http://localhost:5173'];
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) return cb(null, true);
      cb(new Error('Not allowed by CORS'));
    },
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(mongoSanitize());

app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, max: 300, standardHeaders: true, legacyHeaders: false }));
app.use(
  '/api/auth',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many attempts, please try again later.' },
  })
);

app.use(async (_req, res, next) => {
  try { await connectDB(); next(); }
  catch (err) { res.status(500).json({ message: 'Database connection failed', error: err.message }); }
});

app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'kanban-board' }));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/boards', require('./routes/boards'));

app.post('/api/seed', async (req, res) => {
  if (!process.env.SEED_TOKEN || req.headers['x-seed-token'] !== process.env.SEED_TOKEN) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  try {
    const result = await require('./seedRunner')();
    res.json({ message: 'Seed complete', ...result });
  } catch (err) {
    res.status(500).json({ message: 'Seed failed', error: err.message });
  }
});

app.use((req, res) => res.status(404).json({ message: `Route ${req.originalUrl} not found` }));

if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5005;
  app.listen(PORT, () => console.log(`🚀 Kanban API on port ${PORT}`));
}

module.exports = app;
