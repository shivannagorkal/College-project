import History from '../models/History.js';
import { validationResult } from 'express-validator';

export const getAllHistory = async (req, res) => {
  try {
    const history = await History.find().sort({ year: 1 });

    res.status(200).json({
      success: true,
      message: 'History milestones fetched successfully',
      data: history,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

export const createHistory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { year, title, description } = req.body;
    const image = req.file ? req.file.path : '';

    const history = new History({
      year,
      title,
      description,
      image,
    });
    await history.save();

    res.status(201).json({
      success: true,
      message: 'History milestone created successfully',
      data: history,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

export const updateHistory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    let history = await History.findById(req.params.id);

    if (!history) {
      return res.status(404).json({
        success: false,
        message: 'History milestone not found',
      });
    }

    const updateData = req.body;
    if (req.file) {
      updateData.image = req.file.path;
    }

    history = await History.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'History milestone updated successfully',
      data: history,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

export const deleteHistory = async (req, res) => {
  try {
    const history = await History.findByIdAndDelete(req.params.id);

    if (!history) {
      return res.status(404).json({
        success: false,
        message: 'History milestone not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'History milestone deleted successfully',
      data: history,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};
