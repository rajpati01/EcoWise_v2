import Campaign from "../models/Campaign.js";
import User from "../models/User.js";

export const createCampaign = async (req, res) => {
  try {
    const { title, description, location, startDate, endDate } = req.body;

    if (!title || !description || !location || !startDate || !endDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const campaign = new Campaign({
      title,
      description,
      location,
      startDate,
      endDate,
      createdBy: req.user._id, // ⬅️ Make sure req.user exists
      status: "pending",
    });
    
    // console.log("Creating campaign by:", req.user);

    await campaign.save();
    res.status(201).json(campaign);
  } catch (error) {
    console.error("Campaign creation failed:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to create campaign" });
  }
};

export const getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find()
      .populate("createdBy", "username")
      .sort({ date: -1 });
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch campaigns" });
  }
};

// Fetch campaigns created by the user
export const getUserCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ createdBy: req.user._id });
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const joinCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign)
      return res.status(404).json({ message: "Campaign not found" });

    // Defensive: ensure .participants is an array
    if (!Array.isArray(campaign.participants)) campaign.participants = [];

    if (campaign.participants.includes(req.user._id)) {
      return res.status(400).json({ message: "Already joined" });
    }

    campaign.participants.push(req.user._id);
    await campaign.save();

    // Increment user points
    await User.findByIdAndUpdate(
      req.user._id,
      { $inc: { points: 10 } }, 
      { new: true }
    );

    res.json({ message: "Joined campaign successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error joining campaign" });
  }
};

// Admin-only
export const updateCampaignStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!campaign)
      return res.status(404).json({ message: "Campaign not found" });

    res.json(campaign);
  } catch (err) {
    res.status(500).json({ message: "Error updating campaign status" });
  }
};
