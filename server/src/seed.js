import 'dotenv/config';
import { connectDB } from './db.js';
import Tip from './models/Tip.js';
import QuizItem from './models/QuizItem.js';
import User from './models/User.js';
import Goal from './models/Goal.js';
import bcrypt from 'bcryptjs';

const tips = [
  { text: 'Pack your lunch; save about $2 per day' },
  { text: 'Use a shopping list; avoid impulse buys' },
  { text: 'Split streaming plans with family' },
  { text: 'Buy used textbooks; sell old ones' }
];

const quiz = [
  { prompt: 'Laptop for college', answer: 'need', explanation: 'Supports study and coursework' },
  { prompt: 'Latest branded shoes', answer: 'want', explanation: 'Fashion, not essential' },
  { prompt: 'Internet plan for home', answer: 'need', explanation: 'Enables school work' },
  { prompt: 'Concert VIP tickets', answer: 'want', explanation: 'Entertainment upgrade' }
];

async function run() {
  await connectDB(process.env.MONGO_URI);

  await Tip.deleteMany({});
  await QuizItem.deleteMany({});
  await Goal.deleteMany({});
  await User.deleteMany({ email: 'demo@edufin.test' });

  await Tip.insertMany(tips);
  await QuizItem.insertMany(quiz);

  const passwordHash = await bcrypt.hash('password123', 10);
  const demo = await User.create({
    email: 'demo@edufin.test',
    name: 'Demo Student',
    passwordHash
  });

  await Goal.insertMany([
    { userId: demo._id.toString(), itemName: 'Gaming Laptop', targetPrice: 1000, savedAmount: 300 },
    { userId: demo._id.toString(), itemName: 'Noise‑canceling Headphones', targetPrice: 150, savedAmount: 45 }
  ]);

  console.log('Seed complete: demo@edufin.test / password123');
  process.exit(0);
}
run();
