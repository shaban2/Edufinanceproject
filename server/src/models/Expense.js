import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      enum: ['purchase', 'accessory', 'maintenance', 'subscription', 'other'],
      default: 'other'
    },
    date: { type: Date, required: true },
    note: { type: String, default: '' }
  },
  { timestamps: true }
);

// helpful indexes
expenseSchema.index({ userId: 1, date: -1 });
expenseSchema.index({ userId: 1, category: 1, date: -1 });

export default mongoose.model('Expense', expenseSchema);
