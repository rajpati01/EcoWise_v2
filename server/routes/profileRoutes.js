import express from 'express';
import { 
  getUserProfile, 
  getEcoPointsHistory
} from '../controllers/profileController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All profile routes are protected
router.get('/ecopoints', protect, getEcoPointsHistory); // Current user's ecopoints
router.get('/:id/ecopoints', protect, getEcoPointsHistory); // Specific user's ecopoints
router.get('/:id', protect, getUserProfile); // Specific user's profile
router.get('/', protect, getUserProfile); // Current user's profile

export default router;