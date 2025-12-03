import { Router } from 'express';
import Expense from '../models/Expense.js';

const router = Router();

// All routes sit behind verifyJWT at mount time:
// app.use('/api/expenses', verifyJWT, expensesRouter);

// GET /api/expenses?from=&to=&page=1&limit=50
router.get('/', async (req, res) => {
  const { from, to, page = 1, limit = 50 } = req.query;

  const q = { userId: req.user.id };
  if (from || to) {
    q.date = {};
    if (from) q.date.$gte = new Date(from);
    if (to) q.date.$lt = new Date(to);
  }

  const p = Math.max(1, Number(page) || 1);
  const l = Math.max(1, Math.min(200, Number(limit) || 50));

  const items = await Expense.find(q)
    .sort({ date: -1, createdAt: -1 })
    .skip((p - 1) * l)
    .limit(l)
    .lean();

  res.json(items);
});

// POST /api/expenses
// body: { amount, category?, date?, note? }
router.post('/', async (req, res) => {
  const { amount, category = 'other', date, note = '' } = req.body;

  const amt = Number(amount);
  if (!Number.isFinite(amt) || amt < 0) {
    return res.status(400).json({ message: 'Invalid amount' });
  }

  const payload = {
    userId: req.user.id,
    amount: amt,
    category,
    date: date ? new Date(date) : new Date(),
    note
  };

  const created = await Expense.create(payload);
  res.status(201).json(created);
});

// PATCH /api/expenses/:id
router.patch('/:id', async (req, res) => {
  const patch = {};
  if (req.body.amount !== undefined) {
    const v = Number(req.body.amount);
    if (!Number.isFinite(v) || v < 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }
    patch.amount = v;
  }
  if (req.body.category) patch.category = req.body.category;
  if (req.body.date) patch.date = new Date(req.body.date);
  if (req.body.note !== undefined) patch.note = req.body.note;

  const updated = await Expense.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    { $set: patch },
    { new: true }
  ).lean();

  if (!updated) return res.status(404).json({ message: 'Expense not found' });
  res.json(updated);
});

// DELETE /api/expenses/:id
router.delete('/:id', async (req, res) => {
  const r = await Expense.deleteOne({ _id: req.params.id, userId: req.user.id });
  if (r.deletedCount === 0) return res.status(404).json({ message: 'Expense not found' });
  res.json({ ok: true });
});

// GET /api/expenses/summary?from=&to=
router.get('/summary', async (req, res) => {
  const { from, to } = req.query;
  const match = { userId: req.user.id };
  if (from || to) {
    match.date = {};
    if (from) match.date.$gte = new Date(from);
    if (to) match.date.$lt = new Date(to);
  }

  const [doc] = await Expense.aggregate([
    { $match: match },
    {
      $facet: {
        totals: [{ $group: { _id: null, total: { $sum: '$amount' } } }],
        byCategory: [
          { $group: { _id: '$category', total: { $sum: '$amount' } } },
          { $sort: { total: -1 } }
        ],
        byMonth: [
          {
            $group: {
              _id: { $dateToString: { format: '%Y-%m', date: '$date' } },
              total: { $sum: '$amount' }
            }
          },
          { $sort: { _id: 1 } }
        ]
      }
    }
  ]);

  const total = doc?.totals?.[0]?.total || 0;
  const byCategory = (doc?.byCategory || []).map((x) => ({
    category: x._id,
    total: x.total,
    share: total ? x.total / total : 0
  }));
  const topCategory = byCategory[0] || null;
  const byMonth = (doc?.byMonth || []).map((x) => ({ month: x._id, total: x.total }));

  res.json({ total, byCategory, byMonth, topCategory });
});

export default router;
