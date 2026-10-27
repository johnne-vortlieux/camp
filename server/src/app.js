import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import auth from './routes/auth.js';
import products from './routes/products.js';

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
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

export default app;
