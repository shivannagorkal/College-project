import mongoose from 'mongoose';

const facultySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
  },
  subject: {
    type: String,
    required: true,
  },
  qualification: {
    type: String,
  },
  department: {
    type: String,
    enum: ['Science', 'Commerce', 'Languages'],
  },
  experience: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Faculty', facultySchema);
