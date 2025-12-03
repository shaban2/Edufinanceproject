import { Router } from 'express';
import Goal from '../models/Goal.js';

const router = Router();

// simple uid from header; swap for JWT when you add auth
function getUid(req) {
  return req.headers['x-user-id'] || 'anon';
}

// GET /api/goals
router.get('/', async (req, res) => {
  const uid = getUid(req);
  const goals = await Goal.find({ userId: req.user.id }).sort({ createdAt: -1 }).lean();
  res.json(goals);
});

// POST /api/goals
router.post('/', async (req, res) => {
  const uid = getUid(req);
  const { itemName, targetPrice, savedAmount = 0 } = req.body;
  const goal = await Goal.create({ userId: req.user.id , itemName, targetPrice, savedAmount });
  res.status(201).json(goal);
});

// PATCH /api/goals/:id
router.patch('/:id', async (req, res) => {
  const uid = getUid(req);
  const updated = await Goal.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    { $set: req.body },
    { new: true }
  ).lean();
  if (!updated) return res.status(404).json({ message: 'Goal not found' });
  res.json(updated);
});

// DELETE /api/goals/:id
router.delete('/:id', async (req, res) => {
  const uid = getUid(req);
  const r = await Goal.deleteOne({ _id: req.params.id, userId: req.user.id });
  if (r.deletedCount === 0) return res.status(404).json({ message: 'Goal not found' });
  res.json({ ok: true });
});


router.post('/:id/purchase', async (req, res) => {
    const uid = getUid(req);

    if (!req.user?.id) return res.status(401).json({ message: 'Unauthorized' });
    const { purchasePrice, purchasedAt } = req.body;
    const price = Number(purchasePrice);
    if (!Number.isFinite(price) || price < 0) {
      return res.status(400).json({ message: 'Invalid purchase price' });
    }
    const date = purchasedAt ? new Date(purchasedAt) : new Date();
  
    const updated = await Goal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $set: { status: 'purchased', purchasePrice: price, purchasedAt: date } },
      { new: true }
    ).lean();
  
    if (!updated) return res.status(404).json({ message: 'Goal not found' });
    res.json(updated);
  });

export default router;
