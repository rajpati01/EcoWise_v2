import express from 'express';
import { classifyWaste } from '../controllers/wasteController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js'; // Multer setup

const router = express.Router();

router.post('/classify', protect, upload.single('image'), classifyWaste);

export default router;
