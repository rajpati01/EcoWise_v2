import express from "express";
import User from "../models/User.js";
import Classification from "../models/WasteClassification.js";
import Campaign from "../models/Campaign.js";

const router = express.Router();

// GET /api/stats/global
router.get("/global", async (req, res) => {
  try {
    // Total waste items classified (number of Classification docs)
    const wasteItemsClassified = await Classification.countDocuments();

    // Active users (number of User docs)
    const activeUsers = await User.countDocuments();

    // Eco points earned (sum of ecoPoints for all users)
    const ecoPointsAgg = await User.aggregate([
      { $group: { _id: null, total: { $sum: "$ecoPoints" } } }
    ]);
    const ecoPointsEarned = ecoPointsAgg[0]?.total || 0;

    res.json({ wasteItemsClassified, activeUsers, ecoPointsEarned });
  } catch (err) {
    res.status(500).json({ message: "Error getting global stats" });
  }
});

// GET /api/stats/cta
router.get("/cta", async (req, res) => {
  try {
    const activeUsers = await User.countDocuments();
    const itemsClassified = await Classification.countDocuments();
    const communities = await Campaign.countDocuments();
    const pointsAgg = await User.aggregate([
      { $group: { _id: null, total: { $sum: "$ecoPoints" } } }
    ]);
    const pointsEarned = pointsAgg[0]?.total || 0;

    res.json({ activeUsers, itemsClassified, communities, pointsEarned });
  } catch (err) {
    res.status(500).json({ message: "Error getting CTA stats" });
  }
});

export default router;