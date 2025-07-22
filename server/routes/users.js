import express from "express";
import { getMyProfile ,getProfile } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";
import User from "../models/User.js";
const router = express.Router();

function getUserLevel(points) {
  if (points >= 1000) return "Eco Master";
  if (points >= 500) return "Eco Champion";
  if (points >= 200) return "Eco Warrior";
  if (points >= 50) return "Eco Explorer";
  return "Beginner";
}

router.get("/me", protect, getMyProfile);

router.get('/profile', protect, getProfile);

router.get("/leaderboard", async (req, res) => {
  try {
    const topUsers = await User.find({})
      .sort({ ecoPoints: -1 })
      .limit(10)
      .select("username ecoPoints"); // Only select existing fields

    const leaderboard = topUsers.map(u => ({
      id: u._id,
      username: u.username,
      ecoPoints: u.ecoPoints || 0,
      level: getUserLevel(u.ecoPoints || 0),
    }));

    res.json(leaderboard);
  } catch (err) {
    console.error("Leaderboard error:", err);
    res.status(500).json({ message: "Error getting leaderboard" });
  }
});


export default router;