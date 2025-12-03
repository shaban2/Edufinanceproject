import mongoose from 'mongoose';

const quizItemSchema = new mongoose.Schema(
  {
    prompt: { type: String, required: true },
    answer: { type: String, enum: ['need', 'want'], required: true },
    explanation: String
  },
  { timestamps: true }
);

export default mongoose.model('QuizItem', quizItemSchema);
