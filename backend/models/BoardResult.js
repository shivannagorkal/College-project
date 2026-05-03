import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  totalOutOf: { type: Number, default: 100 },
  highestScore: { type: Number, default: 0 },
  passPercentage: { type: Number, default: 0 },
});

const boardResultSchema = new mongoose.Schema({
  year: { type: Number, required: true },
  stream: { 
    type: String, 
    enum: ['Science', 'Commerce'],
    required: true 
  },
  className: { 
    type: String, 
    enum: ['PCMB', 'PCMC', 'Commerce'],
    required: true 
  },
  highestPercentageInStream: { type: Number, default: 0 },
  totalStudents: { type: Number, default: 0 },
  passedStudents: { type: Number, default: 0 },
  passPercentage: { type: Number, default: 0 },
  firstClass: { type: Number, default: 0 },
  distinction: { type: Number, default: 0 },
  subjects: [subjectSchema],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('BoardResult', boardResultSchema);
