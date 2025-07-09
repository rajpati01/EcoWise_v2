import express from 'express';
import { getAllWasteGuides, getWasteGuideByType } from '../controllers/wasteGuideController.js';

const router = express.Router();

router.get('/', getAllWasteGuides);
router.get('/:type', getWasteGuideByType);

export default router;
