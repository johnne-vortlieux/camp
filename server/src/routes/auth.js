import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
const cookieOpts = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};
const safe = (u) => ({ id: u.id, name: u.name, email: u.email });
const setCookie = (res, u) =>
  res.cookie('token', jwt.sign({ id: u.id }, process.env.JWT_SECRET, { expiresIn: '7d' }), cookieOpts);

const registerSchema = z.object({
  name: z.string().trim().min(2).max(60),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8).max(100),
});
const loginSchema = z.object({ email: z.string().trim().toLowerCase().email(), password: z.string().min(1) });

router.post('/register', async (req, res) => {
  const { name, email, password } = registerSchema.parse(req.body);
  if (await User.exists({ email }))
    return res.status(409).json({ error: { message: 'Email already registered' } });
  const user = await User.create({ name, email, passwordHash: await bcrypt.hash(password, 12) });
  setCookie(res, user);
  res.status(201).json({ data: safe(user) });
});

router.post('/login', async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.passwordHash)))
    return res.status(401).json({ error: { message: 'Wrong email or password' } });
  setCookie(res, user);
  res.json({ data: safe(user) });
});

router.post('/logout', (_req, res) => {
  res.clearCookie('token', { ...cookieOpts, maxAge: undefined });
  res.json({ data: 'signed out' });
});

router.get('/me', requireAuth, (req, res) => res.json({ data: safe(req.user) }));

export default router;
