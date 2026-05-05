import CarouselImage from '../models/CarouselImage.js';

export const getCarouselImages = async (req, res) => {
  try {
    const { page } = req.query;
    let filter = {};
    if (page) filter.page = page;
    const images = await CarouselImage.find(filter)
      .sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, data: images });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadCarouselImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image uploaded'
      });
    }
    const { title, page, order } = req.body;
    const carouselImage = await CarouselImage.create({
      image: req.file.path,
      title: title || '',
      page,
      order: Number(order || 0),
    });
    res.status(201).json({ success: true, data: carouselImage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCarouselImage = async (req, res) => {
  try {
    await CarouselImage.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
