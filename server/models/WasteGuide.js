import mongoose from "mongoose";

const wasteGuideSchema = new mongoose.Schema({
  type: { type: String, required: true, unique: true }, // e.g., 'plastic'
  category: { type: String, required: true }, // recyclable, non-recyclable, biodegradable, hazardous
  recyclable: { type: Boolean, required: true },
  biodegradable: { type: Boolean, default: false },
  hazardous: { type: Boolean, default: false },
  instructions: { type: [String], required: true }, // disposal/recycling tips
});

const WasteGuide = mongoose.model("WasteGuide", wasteGuideSchema);

export default WasteGuide;
