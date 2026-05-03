import Announcement from '../models/Announcement.js';
import { validationResult } from 'express-validator';

export const getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ date: -1 });

    res.status(200).json({
      success: true,
      message: 'Announcements fetched successfully',
      data: announcements,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

export const createAnnouncement = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { title, description, date } = req.body;
    const fileUrl = req.file ? req.file.path : '';

    const announcement = new Announcement({
      title,
      description,
      date,
      fileUrl,
    });
    await announcement.save();

    res.status(201).json({
      success: true,
      message: 'Announcement created successfully',
      data: announcement,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

export const updateAnnouncement = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    let announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found',
      });
    }

    const updateData = req.body;
    if (req.file) {
      updateData.fileUrl = req.file.path;
    }

    announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Announcement updated successfully',
      data: announcement,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

export const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Announcement deleted successfully',
      data: announcement,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};
