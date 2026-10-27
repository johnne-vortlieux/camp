import { Router } from 'express';
import { z } from 'zod';
import Product, { CATEGORIES, CONDITIONS } from '../models/Product.js';
import { optionalAuth, requireAuth } from '../middleware/auth.js';

const router = Router();

const createSchema = z.object({
  title: z.string().trim().min(3).max(100),
  description: z.string().trim().max(1000).optional(),
  price: z.coerce.number().min(0).max(1000000),
  category: z.enum(CATEGORIES),
  condition: z.enum(CONDITIONS),
  imageUrl: z.string().trim().url().max(500).or(z.literal('')).optional(),
});
const updateSchema = createSchema.partial().extend({ isSold: z.boolean().optional() });

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

async function loadOwned(req, res) {
  const product = await Product.findOne({ _id: req.params.id, isDeleted: false });
  if (!product) {
    res.status(404).json({ error: { message: 'Listing not found' } });
    return null;
  }
  if (String(product.seller) !== req.user.id) {
    res.status(403).json({ error: { message: 'Not your listing' } });
    return null;
  }
  return product;
}

router.get('/', async (req, res) => {
  const { search, category } = req.query;
  const filter = { isSold: false, isDeleted: false };
  if (typeof search === 'string' && search.trim())
    filter.title = { $regex: escapeRegex(search.trim().slice(0, 60)), $options: 'i' };
  if (CATEGORIES.includes(category)) filter.category = category;
  const items = await Product.find(filter).sort('-createdAt').limit(40).populate('seller', 'name').lean();
  res.json({ data: items });
});

router.get('/mine', requireAuth, async (req, res) => {
  const items = await Product.find({ seller: req.user.id, isDeleted: false }).sort('-createdAt').lean();
  res.json({ data: items });
});

router.get('/:id', optionalAuth, async (req, res) => {
  const p = await Product.findOne({ _id: req.params.id, isDeleted: false })
    .populate('seller', 'name email')
    .lean();
  if (!p) return res.status(404).json({ error: { message: 'Listing not found' } });
  p.isOwner = !!req.user && String(p.seller._id) === req.user.id;
  if (!req.user) delete p.seller.email; // contact visible to signed-in students only
  res.json({ data: p });
});

router.post('/', requireAuth, async (req, res) => {
  const data = createSchema.parse(req.body);
  const product = await Product.create({ ...data, seller: req.user.id });
  res.status(201).json({ data: product });
});

router.patch('/:id', requireAuth, async (req, res) => {
  const product = await loadOwned(req, res);
  if (!product) return;
  product.set(updateSchema.parse(req.body));
  await product.save();
  res.json({ data: product });
});

router.delete('/:id', requireAuth, async (req, res) => {
  const product = await loadOwned(req, res);
  if (!product) return;
  product.isDeleted = true;
  await product.save();
  res.json({ data: 'removed' });
});

export default router;
