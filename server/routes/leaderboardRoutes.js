import express from 'express';
import { 
  getLeaderboard, 
  getLeaderboardFromUsers,
  getUserRank
} from '../controllers/leaderboardController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', async (req, res) => {
  try {
    // Try to get from EcoPoint model first
    await getLeaderboard(req, res);
  } catch (error) {
    // If it fails, fall back to User model
    await getLeaderboardFromUsers(req, res);
  }
});

// Protected routes
router.get('/user', protect, getUserRank); // Current user's rank
router.get('/user/:id', protect, getUserRank); // Specific user's rank

export default router;