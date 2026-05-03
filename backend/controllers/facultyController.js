import Faculty from '../models/Faculty.js';
import { validationResult } from 'express-validator';

export const getAllFaculty = async (req, res) => {
  try {
    const { department } = req.query;
    let filter = {};

    if (department) filter.department = department;

    const faculty = await Faculty.find(filter).sort({ name: 1 });

    res.status(200).json({
      success: true,
      message: 'Faculty fetched successfully',
      data: faculty,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

export const createFaculty = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, subject, qualification, department, experience } = req.body;
    const photo = req.file ? req.file.path : '';

    const faculty = new Faculty({
      name,
      subject,
      qualification,
      department,
      experience,
      photo,
    });
    await faculty.save();

    res.status(201).json({
      success: true,
      message: 'Faculty created successfully',
      data: faculty,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

export const updateFaculty = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    let faculty = await Faculty.findById(req.params.id);

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty not found',
      });
    }

    const updateData = req.body;
    if (req.file) {
      updateData.photo = req.file.path;
    }

    faculty = await Faculty.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Faculty updated successfully',
      data: faculty,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

export const deleteFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findByIdAndDelete(req.params.id);

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Faculty deleted successfully',
      data: faculty,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};
