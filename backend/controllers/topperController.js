import Topper from '../models/Topper.js';

export const getToppers = async (req, res) => {
  try {
    const { year, topperType, stream } = req.query;
    const filter = {};

    if (year) filter.year = Number(year);
    if (topperType) filter.topperType = topperType;
    if (stream) filter.stream = stream;

    const toppers = await Topper.find(filter).sort({ rank: 1 });
    res.status(200).json({ success: true, data: toppers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createTopper = async (req, res) => {
  try {
    const data = { ...req.body };

    if (data.year) data.year = Number(data.year);
    if (data.rank) data.rank = Number(data.rank);
    if (data.percentage) data.percentage = Number(data.percentage);
    if (data.score) data.score = Number(data.score);
    if (data.outOf) data.outOf = Number(data.outOf);
    if (data.percentile) data.percentile = Number(data.percentile);
    if (data.karnatakaRank) data.karnatakaRank = Number(data.karnatakaRank);
    if (req.file) data.photo = req.file.path;

    const topper = await Topper.create(data);
    res.status(201).json({ success: true, data: topper });
  } catch (error) {
    console.error('Create topper error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTopper = async (req, res) => {
  try {
    const data = { ...req.body };

    if (data.year) data.year = Number(data.year);
    if (data.rank) data.rank = Number(data.rank);
    if (data.percentage) data.percentage = Number(data.percentage);
    if (data.score) data.score = Number(data.score);
    if (data.outOf) data.outOf = Number(data.outOf);
    if (data.percentile) data.percentile = Number(data.percentile);
    if (data.karnatakaRank) data.karnatakaRank = Number(data.karnatakaRank);
    if (req.file) data.photo = req.file.path;

    const topper = await Topper.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true }
    );

    if (!topper) {
      return res.status(404).json({
        success: false,
        message: 'Topper not found',
      });
    }

    res.status(200).json({ success: true, data: topper });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTopper = async (req, res) => {
  try {
    await Topper.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
