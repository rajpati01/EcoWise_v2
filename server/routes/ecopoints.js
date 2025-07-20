import express from 'express';
import { protect } from '../middleware/auth.js';
import EcoPoint from '../models/EcoPoints.js';
import User from '../models/User.js';
import isAdmin from '../middleware/admin.js';

const router = express.Router();

// Get current user's eco points
router.get('/my-points', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const ecoPoints = await EcoPoint.findOne({ user: userId });
    
    res.json({
      success: true,
      data: { 
        totalPoints: ecoPoints ? ecoPoints.totalPoints : 0 
      }
    });
  } catch (error) {
    console.error("Error fetching user points:", error);
    res.status(500).json({ message: error.message });
  }
});

// Debug endpoint to see all EcoPoints
router.get('/debug', protect, isAdmin, async (req, res) => {
  try {
    const allPoints = await EcoPoint.find().populate('user', 'name username');
    
    res.json({
      success: true,
      data: allPoints
    });
  } catch (error) {
    console.error("Error in debug endpoint:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;