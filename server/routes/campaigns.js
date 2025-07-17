import express from "express";
import {
  createCampaign,
  getAllCampaigns,
  joinCampaign,
  updateCampaignStatus,
  getUserCampaigns,
  getJoinedCampaigns,
} from "../controllers/campaignController.js";
import { protect } from "../middleware/auth.js";
import  isAdmin  from "../middleware/admin.js";

const router = express.Router();

router.post("/", protect, createCampaign);
router.get("/", getAllCampaigns);
router.post("/:id/join", protect, joinCampaign);
router.patch("/:id/status", protect, isAdmin, updateCampaignStatus);
router.get("/my", protect, getUserCampaigns);
router.get("/joined", protect, getJoinedCampaigns);

export default router;
