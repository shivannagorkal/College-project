import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  subject: { type: String, default: '' },
  totalOutOf: { type: Number, default: 100 },
  highestScore: { type: Number, default: 0 },
  passPercentage: { type: Number, default: 0 },
});

const resultSchema = new mongoose.Schema({
  year: { type: Number, required: true },
  resultType: {
    type: String,
    enum: ['Board', 'NEET', 'JEE', 'KCET'],
    required: true,
  },
  stream: { type: String, default: '' },
  className: { type: String, default: '' },
  totalStudents: { type: Number, default: 0 },
  passedStudents: { type: Number, default: 0 },
  passPercentage: { type: Number, default: 0 },
  firstClass: { type: Number, default: 0 },
  distinction: { type: Number, default: 0 },
  highestPercentageInStream: { type: Number, default: 0 },
  subjects: [subjectSchema],
  totalAppeared: { type: Number, default: 0 },
  totalQualified: { type: Number, default: 0 },
  qualifiedPercentage: { type: Number, default: 0 },
  highestScore: { type: Number, default: 0 },
  topScore: { type: Number, default: 0 },
  topperName: { type: String, default: '' },
  description: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Result', resultSchema);
