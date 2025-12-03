import { Router } from 'express';
import QuizItem from '../models/QuizItem.js';

const router = Router();

// GET /api/quiz
router.get('/', async (_req, res) => {
  const items = await QuizItem.find({}).lean();
  res.json(items);
});

export default router;
