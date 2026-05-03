import BoardResult from '../models/BoardResult.js';

export const getBoardResults = async (req, res) => {
  try {
    const { year, stream, className } = req.query;
    let filter = {};
    if (year) filter.year = Number(year);
    if (stream) filter.stream = stream;
    if (className) filter.className = className;
    const results = await BoardResult.find(filter)
      .sort({ year: -1, stream: 1 });
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createBoardResult = async (req, res) => {
  try {
    const data = { ...req.body };
    data.year = Number(data.year);
    data.totalStudents = Number(data.totalStudents || 0);
    data.passedStudents = Number(data.passedStudents || 0);
    data.firstClass = Number(data.firstClass || 0);
    data.distinction = Number(data.distinction || 0);
    data.highestPercentageInStream = Number(
      data.highestPercentageInStream || 0
    );
    if (data.passedStudents && data.totalStudents) {
      data.passPercentage = Math.round(
        (data.passedStudents / data.totalStudents) * 100
      );
    }
    if (typeof data.subjects === 'string') {
      data.subjects = JSON.parse(data.subjects);
    }
    if (Array.isArray(data.subjects)) {
      data.subjects = data.subjects.map(sub => ({
        subject: sub.subject,
        totalOutOf: Number(sub.totalOutOf || 100),
        highestScore: Number(sub.highestScore || 0),
        passPercentage: Number(sub.passPercentage || 0),
      }));
    }
    const result = await BoardResult.create(data);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.error('Board result error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBoardResult = async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.year) data.year = Number(data.year);
    if (data.passedStudents && data.totalStudents) {
      data.passPercentage = Math.round(
        (Number(data.passedStudents) / Number(data.totalStudents)) * 100
      );
    }
    if (typeof data.subjects === 'string') {
      data.subjects = JSON.parse(data.subjects);
    }
    const result = await BoardResult.findByIdAndUpdate(
      req.params.id, data, { new: true }
    );
    if (!result) return res.status(404).json({ 
      success: false, message: 'Not found' 
    });
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteBoardResult = async (req, res) => {
  try {
    await BoardResult.findByIdAndDelete(req.params.id);
    res.status(200).json({ 
      success: true, message: 'Deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
