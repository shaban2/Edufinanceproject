import { Router } from 'express';
import Tip from '../models/Tip.js';

const router = Router();

// GET /api/tips/random?count=1
// router.get('/random', async (req, res) => {
//   const count = Math.max(1, Math.min(50, Number(req.query.count) || 1));
//   const items = await Tip.aggregate([{ $sample: { size: count } }]);
//   res.json(items);
// });

router.get('/', async (_req, res) => {
  const tips = await Tip.find({}, { text: 1 }).lean();
  res.json(tips);
});

export default router;
