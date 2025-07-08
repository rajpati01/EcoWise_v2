import express from "express";
import { addPoints, getUserEcoPoints } from "../controllers/ecoPointsController.js";
import { protect } from "../middleware/auth.js"; 

const router = express.Router();

// Add or update eco points
router.post("/add", protect, addPoints);

// Get user eco points
router.get("/:userId", protect, getUserEcoPoints);

export default router;
