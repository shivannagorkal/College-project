import CompetitiveResult from '../models/CompetitiveResult.js';

export const getCompetitiveResults = async (req, res) => {
  try {
    const { year, resultType } = req.query;
    let filter = {};
    if (year) filter.year = Number(year);
    if (resultType) filter.resultType = resultType;
    const results = await CompetitiveResult.find(filter)
      .sort({ year: -1 });
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createCompetitiveResult = async (req, res) => {
  try {
    const data = { ...req.body };
    data.year = Number(data.year);
    data.totalAppeared = Number(data.totalAppeared || 0);
    data.totalQualified = Number(data.totalQualified || 0);
    data.highestScore = Number(data.highestScore || 0);
    if (data.totalAppeared && data.totalQualified) {
      data.qualifiedPercentage = Math.round(
        (data.totalQualified / data.totalAppeared) * 100
      );
    }
    const result = await CompetitiveResult.create(data);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.error('Competitive result error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCompetitiveResult = async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.totalAppeared && data.totalQualified) {
      data.qualifiedPercentage = Math.round(
        (Number(data.totalQualified) / Number(data.totalAppeared)) * 100
      );
    }
    const result = await CompetitiveResult.findByIdAndUpdate(
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

export const deleteCompetitiveResult = async (req, res) => {
  try {
    await CompetitiveResult.findByIdAndDelete(req.params.id);
    res.status(200).json({ 
      success: true, message: 'Deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
