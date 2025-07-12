import express from 'express';
import { protect } from '../middleware/auth.js';
import  isAdmin  from '../middleware/admin.js'; 
import {
  approveCampaign,
  rejectCampaign,
  approveBlog,
  rejectBlog,
} from '../controllers/adminController.js';

const router = express.Router();

// Campaign approval/rejection
router.post('/campaigns/:id/approve', protect, isAdmin, approveCampaign);
router.post('/campaigns/:id/reject', protect, isAdmin, rejectCampaign);

// Blog approval/rejection
router.post('/blogs/:id/approve', protect, isAdmin, approveBlog);
router.post('/blogs/:id/reject', protect, isAdmin, rejectBlog);

export default router;