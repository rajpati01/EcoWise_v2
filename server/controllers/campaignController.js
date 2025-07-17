import Campaign from "../models/Campaign.js";
import User from "../models/user.js";
import updateEcoPoints from "../utils/ecoPointsHelper.js";

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
      createdBy: req.user._id,
      status: "pending",
    });
    // console.log("Creating campaign by:", req.user);

    // Add EcoPoints (10 points for creating a campaign)
    await updateEcoPoints(
      req.user._id,
      "campaign",
      10,
      `Created campaign: ${campaign.title}`
    );

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

// For joining a campaign
export const joinCampaign = async (req, res) => {
  try {
    console.log("Join campaign request received for campaign:", req.params.id);
    console.log("User attempting to join:", req.user._id);

    const campaign = await Campaign.findById(req.params.id);
    if (!campaign)
      return res.status(404).json({ message: "Campaign not found" });

    // Check if participants exists and is an array
    if (!campaign.participants || !Array.isArray(campaign.participants)) {
      campaign.participants = [];
    }

    // Check if user is already a participant
    const userId = req.user._id.toString();
    let alreadyJoined = false;

    // Check existing participants
    for (let i = 0; i < campaign.participants.length; i++) {
      const participant = campaign.participants[i];

      // Check if participant has valid structure
      if (!participant.user) {
        // Fix invalid participant by removing it
        console.log(`Fixing invalid participant at index ${i}`);
        campaign.participants.splice(i, 1);
        i--; // Adjust index since we removed an element
        continue;
      }

      // Check if user already joined
      const participantId = participant.user.toString();
      if (participantId === userId) {
        alreadyJoined = true;
        break;
      }
    }

    if (alreadyJoined) {
      console.log("User already joined this campaign");
      return res.status(400).json({ message: "Already joined" });
    }

    // Add user to participants with current date
    campaign.participants.push({
      user: req.user._id,
      joinedAt: new Date(),
    });

    console.log("Saving campaign with new participant");
    await campaign.save();

    // Add EcoPoints (3 points for joining)
    try {
      await updateEcoPoints(
        req.user._id,
        "join_campaign",
        3,
        `Joined campaign: ${campaign.title}`
      );
      console.log("EcoPoints awarded for joining campaign");
    } catch (ecoPointsError) {
      console.error("Error awarding EcoPoints (non-critical):", ecoPointsError);
      // Continue even if EcoPoints update fails
    }

    return res.json({
      success: true,
      message: "Joined campaign successfully",
      campaign: {
        _id: campaign._id,
        title: campaign.title,
        participantCount: campaign.participants.length,
      },
    });
  } catch (err) {
    console.error("Error joining campaign:", err);
    res.status(500).json({
      message: "Error joining campaign",
      error: err.message || "Unknown error",
    });
  }
};

// Fetch campaigns where user is a participant
export const getJoinedCampaigns = async (req, res) => {
  try {
    // Find campaigns where user is a participant
    const campaigns = await Campaign.find({
      "participants.user": req.user._id,
    })
      .populate("createdBy", "username")
      .sort({ startDate: -1 });
    return res.json(campaigns || []);
  } catch (err) {
    console.error("Error fetching joined campaigns:", err);
    return res
      .status(500)
      .json({ message: "Failed to fetch joined campaigns" });
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
