import mongoose from "mongoose";

const participantSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
});

const campaignSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: String,
    location: {
      type: String,
      required: true,
    },
    coordinates: {
      lat: Number,
      lng: Number,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    participants: [participantSchema],
    category: {
      type: String,
      enum: [
        "Cleanup",
        "Education",
        "Conservation",
        "Recycling",
        "Planting",
        "Other",
      ],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", 'completed'],
      default: "pending",
    },
    maxParticipants: {
      type: Number,
      default: 0, // 0 means unlimited
    },
  },
  { timestamps: true }
);

// Method to check if campaign is full
campaignSchema.methods.isFull = function () {
  return (
    this.maxParticipants > 0 && this.participants.length >= this.maxParticipants
  );
};

// Virtual property for participant count
campaignSchema.virtual("participantCount").get(function () {
  return this.participants.length;
});

// Ensure virtuals are included when converting to JSON
campaignSchema.set("toJSON", { virtuals: true });
campaignSchema.set("toObject", { virtuals: true });

// Check if model exists before compiling
const Campaign =
  mongoose.models.Campaign || mongoose.model("Campaign", campaignSchema);

export default Campaign;
