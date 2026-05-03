import Gallery from '../models/Gallery.js';
import { validationResult } from 'express-validator';

export const getAllGallery = async (req, res) => {
  try {
    const { category, year } = req.query;
    let filter = {};

    if (category) filter.category = category;
    if (year) filter.year = year;

    const gallery = await Gallery.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Gallery fetched successfully',
      data: gallery,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

export const uploadGalleryImage = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image uploaded',
      });
    }

    const { title, category, year } = req.body;

    const galleryItem = new Gallery({
      title,
      image: req.file.path,
      category,
      year,
    });

    await galleryItem.save();

    res.status(201).json({
      success: true,
      message: 'Gallery image uploaded successfully',
      data: galleryItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

export const deleteGalleryImage = async (req, res) => {
  try {
    const galleryItem = await Gallery.findByIdAndDelete(req.params.id);

    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Gallery image deleted successfully',
      data: galleryItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};
