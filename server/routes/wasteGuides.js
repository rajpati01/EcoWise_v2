import express from 'express';
import { getAllWasteGuides, getWasteGuideByCategory } from '../controllers/wasteGuideController.js';

const router = express.Router();

router.get('/', getAllWasteGuides);
router.get('/:category', getWasteGuideByCategory);

export default router;
