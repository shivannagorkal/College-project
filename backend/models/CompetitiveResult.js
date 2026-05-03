import mongoose from 'mongoose';

const competitiveResultSchema = new mongoose.Schema({
  year: { type: Number, required: true },
  resultType: {
    type: String,
    enum: ['NEET', 'JEE', 'KCET'],
    required: true,
  },
  totalAppeared: { type: Number, default: 0 },
  totalQualified: { type: Number, default: 0 },
  qualifiedPercentage: { type: Number, default: 0 },
  highestScore: { type: Number, default: 0 },
  description: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('CompetitiveResult', competitiveResultSchema);
