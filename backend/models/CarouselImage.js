import mongoose from 'mongoose';

const carouselImageSchema = new mongoose.Schema({
  image: { type: String, required: true },
  title: { type: String, default: '' },
  page: {
    type: String,
    enum: [
      'home',
      'about',
      'academics',
      'results',
      'toppers',
      'events',
      'gallery',
      'faculty',
      'admissions',
      'announcements',
      'history',
      'contact'
    ],
    required: true
  },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('CarouselImage', carouselImageSchema);
