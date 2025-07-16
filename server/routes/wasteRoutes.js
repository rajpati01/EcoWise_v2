import express from "express";
import {
  classifyWaste,
  getUserClassifications,
} from "../controllers/wasteController.js";
import { protect } from "../middleware/auth.js";
import upload from "../middleware/upload.js"; // Multer setup

const router = express.Router();

router.post(
  "/classify",
  protect,
  (req, res, next) => {
    upload.single("image")(req, res, function (err) {
      if (err) {
        // Multer error
        return res
          .status(400)
          .json({ message: "File upload error", error: err.message });
      }
      next();
    });
  },
  classifyWaste
);
router.get("/classifications", protect, getUserClassifications);

export default router;
