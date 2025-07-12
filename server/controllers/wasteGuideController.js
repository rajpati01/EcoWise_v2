import WasteGuide from '../models/WasteGuide.js';

export const getAllWasteGuides = async (req, res) => {
  try {
    const guides = await WasteGuide.find();
    res.status(200).json(guides);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getWasteGuideByType = async (req, res) => {
  try {
    const guide = await WasteGuide.findOne({ category: req.params.category });
    if (!guide) return res.status(404).json({ message: 'Not found' });
    res.status(200).json(guide);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
