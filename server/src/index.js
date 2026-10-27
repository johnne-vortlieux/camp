import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import auth from './routes/auth.js';
import products from './routes/products.js';

const { MONGODB_URI, JWT_SECRET, CLIENT_URL, PORT = 5000 } = process.env;
if (!MONGODB_URI || !CLIENT_URL || !JWT_SECRET || JWT_SECRET.length < 32) {
  console.error('Set MONGODB_URI, CLIENT_URL and a JWT_SECRET (32+ chars) in server/.env');
  process.exit(1);
}

const app = express();
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get('/health', (_req, res) => res.json({ data: 'ok' }));
app.use('/api/auth', auth);
app.use('/api/products', products);

app.use((err, _req, res, _next) => {
  if (err.name === 'ZodError')
    return res.status(400).json({ error: { message: 'Invalid input', details: err.issues } });
  if (err.name === 'CastError') return res.status(404).json({ error: { message: 'Not found' } });
  console.error(err);
  res.status(500).json({ error: { message: 'Server error' } });
});

await mongoose.connect(MONGODB_URI);
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
