import mongoose from 'mongoose';

const admissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  stream: {
    type: String,
    enum: ['Science', 'Commerce'],
  },
  message: {
    type: String,
  },
  status: {
    type: String,
    enum: ['Pending', 'Contacted', 'Admitted'],
    default: 'Pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Admission', admissionSchema);
