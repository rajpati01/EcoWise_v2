import WasteClassification from "../models/WasteClassification.js";
import EcoPoints from "../models/EcoPoints.js"
import updateEcoPoints from "../utils/ecoPointsHelper.js";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";

export const classifyWaste = async (req, res) => {
  try {
    const user = req.user;
    const file = req.file;
    // console.log("File received:", req.file);

    if (!file) {
      return res.status(400).json({ message: "Image file is required." });
    }

    // Prepare image for FastAPI
    const formData = new FormData();
    formData.append("file", fs.createReadStream(file.path), file.filename);

    // Call FastAPI (adjust URL as needed)
    const aiRes = await axios.post(
      `${process.env.VITE_AI_API_URL}/api/classify`,
      formData,
      { headers: formData.getHeaders() }
    );

    const ai = aiRes.data;
    // ai = { type, confidence, instructions, category, pointsEarned, filename }

    const classification = await WasteClassification.create({
      user: user._id,
      imageUrl: file.path,
      category: ai.category,
      confidence: ai.confidence,
      pointsEarned: ai.pointsEarned,
    });

    // Add EcoPoints (1 point for classification)
    await updateEcoPoints(
      req.user._id,
      'classification',
      1,
      `Classified ${classification.wasteType}`
    );

    //  Update EcoPoints
    let ecoPoints = await EcoPoints.findOne({ user: user._id });

    if (!ecoPoints) {
      ecoPoints = new EcoPoints({
        user: user._id,
        totalPoints: ai.pointsEarned,
        history: [
          {
            action: "classification",
            points: ai.pointsEarned,
            description: `Classified ${ai.category}`,
          },
        ],
      });
    } else {
      ecoPoints.totalPoints += ai.pointsEarned;
      ecoPoints.history.unshift({
        action: "classification",
        points: ai.pointsEarned,
        description: `Classified ${ai.category}`,
      });
    }

    await ecoPoints.save();

    res.status(200).json(ai); // Send back all AI info for frontend
  } catch (error) {
    console.error("Classification error:", error);
    res.status(500).json({ message: "Classification failed", error: error?.message || error });
  }
};

// Get all classifications for the logged-in user
export const getUserClassifications = async (req, res) => {
  try {
    
    // Find all classifications for the current user
    const classifications = await WasteClassification.find({ 
      user: req.user._id 
    })
    .sort({ createdAt: -1 });

    return res.json(classifications);
  } catch (err) {
    console.error('Error fetching user classifications:', err);
    return res.status(500).json({ message: 'Failed to fetch classifications' });
  }
};
