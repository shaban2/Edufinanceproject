import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './db.js';
import tipsRouter from './routes/tips.js';
import quizRouter from './routes/quiz.js';
import goalsRouter from './routes/goals.js';
import authRouter, { verifyJWT } from './routes/auth.js'; 
import expensesRouter from './routes/expenses.js';
import resourcesRouter from './routes/resources.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.use('/api/tips', tipsRouter);
app.use('/api/quiz', quizRouter);
// app.use('/api/goals', goalsRouter);
app.use('/api/goals', verifyJWT, goalsRouter);

app.use('/api/auth', authRouter); 

app.use('/api/expenses', verifyJWT, expensesRouter);

app.use('/api/resources', resourcesRouter);


const port = process.env.PORT || 5000;

connectDB(process.env.MONGO_URI)
  .then(() => app.listen(port, () => console.log(`API running on :${port}`)))
  .catch((err) => {
    console.error('DB error', err);
    process.exit(1);
  });
