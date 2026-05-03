import mongoose from 'mongoose';

const topperSchema = new mongoose.Schema({
  name: { type: String, required: true },
  photo: { type: String, default: '' },
  year: { type: Number, required: true },
  rank: { type: Number, required: true },
  topperType: {
    type: String,
    enum: ['Board', 'NEET', 'JEE', 'KCET'],
    default: 'Board',
    required: true,
  },

  stream: { type: String, enum: ['Science', 'Commerce', ''] },
  group: { type: String, enum: ['PCMB', 'PCMC', 'Commerce', ''] },
  percentage: { type: Number, default: 0 },

  score: { type: Number, default: 0 },
  outOf: { type: Number, default: 0 },
  percentile: { type: Number, default: 0 },
  karnatakaRank: { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Topper', topperSchema);
