import jwt from 'jsonwebtoken';
import User from '../models/User.js';

async function readUser(req) {
  const token = req.cookies?.token;
  if (!token) return null;
  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    return await User.findById(id).select('name email');
  } catch {
    return null;
  }
}

export async function optionalAuth(req, _res, next) {
  req.user = await readUser(req);
  next();
}

export async function requireAuth(req, res, next) {
  req.user = await readUser(req);
  if (!req.user) return res.status(401).json({ error: { message: 'Sign in required' } });
  next();
}
