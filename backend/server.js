const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();

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

app.use(async (_req, res, next) => {
  try { await connectDB(); next(); }
  catch (err) { res.status(500).json({ message: 'Database connection failed', error: err.message }); }
});

app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'kanban-board' }));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/boards', require('./routes/boards'));

app.use((req, res) => res.status(404).json({ message: `Route ${req.originalUrl} not found` }));

if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5005;
  app.listen(PORT, () => console.log(`🚀 Kanban API on port ${PORT}`));
}

module.exports = app;
