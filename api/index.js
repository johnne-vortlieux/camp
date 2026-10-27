import mongoose from 'mongoose';
import app from '../server/src/app.js';

let connection;

export default async function handler(req, res) {
  try {
    connection ??= mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 8000 });
    await connection;
  } catch (err) {
    connection = undefined;
    console.error('Mongo connection failed:', err.message);
    return res.status(503).json({ error: { message: 'Database unavailable' } });
  }
  return app(req, res);
}
