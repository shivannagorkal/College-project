import mongoose from 'mongoose';

const topperSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
  },
  year: {
    type: Number,
    required: true,
  },
  stream: {
    type: String,
    enum: ['Science', 'Commerce'],
  },
  subject: {
    type: String,
  },
  marks: {
    type: Number,
  },
  percentage: {
    type: Number,
  },
  rank: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Topper', topperSchema);
