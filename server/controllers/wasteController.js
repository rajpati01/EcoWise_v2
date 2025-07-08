import WasteClassification from '../models/WasteClassification.js';
import EcoPoints from '../models/ecopoints.js';
import { classifyImage } from '../utils/classifyImage.js'; // fake or real classifier

export const classifyWaste = async (req, res) => {
  try {
    const user = req.user;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'Image file is required.' });
    }

    // Fake classifier — replace with actual TensorFlow later
    const { category, confidence, instructions, pointsEarned } = classifyImage(file);

    const classification = await WasteClassification.create({
      user: user._id,
      imageUrl: file.path,
      category,
      confidence,
      pointsEarned
    });

    //  Update EcoPoints
    let ecoPoints = await EcoPoints.findOne({ user: user._id });

    if (!ecoPoints) {
      ecoPoints = new EcoPoints({
        user: user._id,
        totalPoints: pointsEarned,
        history: [{
          action: 'classification',
          points: pointsEarned,
          description: `Classified ${category}`
        }]
      });
    } else {
      ecoPoints.totalPoints += pointsEarned;
      ecoPoints.history.unshift({
        action: 'classification',
        points: pointsEarned,
        description: `Classified ${category}`
      });
    }

    await ecoPoints.save();

    res.status(200).json({
      category,
      confidence,
      instructions,
      pointsEarned
    });
  } catch (error) {
    console.error('Classification error:', error);
    res.status(500).json({ message: 'Classification failed', error });
  }
};
