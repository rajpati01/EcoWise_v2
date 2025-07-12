import mongoose from "mongoose";

const ecoPointsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // One record per user
    },
    totalPoints: {
      type: Number,
      default: 0,
    },
    history: [
      {
        action: String,
        points: Number,
        description: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);
const EcoPoints = mongoose.model("EcoPoints", ecoPointsSchema);
export default EcoPoints;
