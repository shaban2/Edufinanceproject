import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    itemName: { type: String, required: true },
    targetPrice: { type: Number, required: true, min: 0 },
    savedAmount: { type: Number, required: true, min: 0 },

    // new fields
    status: { type: String, enum: ['active', 'purchased', 'archived'], default: 'active' },
    purchasePrice: { type: Number, min: 0 },
    purchasedAt: { type: Date }
  },
  { timestamps: true }
);

export default mongoose.model('Goal', goalSchema);
