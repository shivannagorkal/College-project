import './config/env.js';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import boardResultRoutes from './routes/boardResultRoutes.js';
import competitiveResultRoutes from './routes/competitiveResultRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import topperRoutes from './routes/topperRoutes.js';
import facultyRoutes from './routes/facultyRoutes.js';
import announcementRoutes from './routes/announcementRoutes.js';
import admissionRoutes from './routes/admissionRoutes.js';
import historyRoutes from './routes/historyRoutes.js';
import siteSettingsRoutes from './routes/siteSettingsRoutes.js';
import carouselRoutes from './routes/carouselRoutes.js';

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || /^http:\/\/localhost:\d+$/.test(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend is running',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/board-results', boardResultRoutes);
app.use('/api/competitive-results', competitiveResultRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/toppers', topperRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/admissions', admissionRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/settings', siteSettingsRoutes);
app.use('/api/carousel', carouselRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
