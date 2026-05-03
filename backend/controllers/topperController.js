import Topper from '../models/Topper.js';
import { validationResult } from 'express-validator';

export const getAllToppers = async (req, res) => {
  try {
    const { year, stream } = req.query;
    let filter = {};

    if (year) filter.year = year;
    if (stream) filter.stream = stream;

    const toppers = await Topper.find(filter).sort({ rank: 1 });

    res.status(200).json({
      success: true,
      message: 'Toppers fetched successfully',
      data: toppers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

export const createTopper = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, year, stream, subject, marks, percentage, rank } = req.body;
    const photo = req.file ? req.file.path : '';

    const topper = new Topper({
      name,
      year,
      stream,
      subject,
      marks,
      percentage,
      rank,
      photo,
    });
    await topper.save();

    res.status(201).json({
      success: true,
      message: 'Topper created successfully',
      data: topper,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

export const updateTopper = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    let topper = await Topper.findById(req.params.id);

    if (!topper) {
      return res.status(404).json({
        success: false,
        message: 'Topper not found',
      });
    }

    const updateData = req.body;
    if (req.file) {
      updateData.photo = req.file.path;
    }

    topper = await Topper.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Topper updated successfully',
      data: topper,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

export const deleteTopper = async (req, res) => {
  try {
    const topper = await Topper.findByIdAndDelete(req.params.id);

    if (!topper) {
      return res.status(404).json({
        success: false,
        message: 'Topper not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Topper deleted successfully',
      data: topper,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};
