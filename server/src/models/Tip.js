import mongoose from 'mongoose';

const tipSchema = new mongoose.Schema(
  { text: { type: String, required: true }, category: String },
  { timestamps: true }
);

export default mongoose.model('Tip', tipSchema);
