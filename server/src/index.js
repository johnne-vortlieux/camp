import 'dotenv/config';
import mongoose from 'mongoose';
import app from './app.js';

const { MONGODB_URI, JWT_SECRET, CLIENT_URL, PORT = 5000 } = process.env;
if (!MONGODB_URI || !CLIENT_URL || !JWT_SECRET || JWT_SECRET.length < 32) {
  console.error('Set MONGODB_URI, CLIENT_URL and a JWT_SECRET (32+ chars) in server/.env');
  process.exit(1);
}

await mongoose.connect(MONGODB_URI);
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
