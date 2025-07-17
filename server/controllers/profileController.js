import User from "../models/user.js";
import EcoPoint from "../models/ecopoints.js";
import Campaign from "../models/campaign.js";

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id || req.user._id;

    // Get user data
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Get user's EcoPoints
    const ecoPoints = await EcoPoint.findOne({ user: userId });

    // Get user's activities - limit to 5 most recent of each type
    const articles = await Article.find({ author: userId })
      .sort({ createdAt: -1 })
      .limit(5);

    const createdCampaigns = await Campaign.find({ creator: userId })
      .sort({ createdAt: -1 })
      .limit(5);

    // Get campaigns the user has joined
    const joinedCampaigns = await Campaign.find({
      participants: { $elemMatch: { user: userId } },
    })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      profile: {
        user,
        ecoPoints: ecoPoints || { totalPoints: 0, history: [] },
        activities: {
          articles,
          createdCampaigns,
          joinedCampaigns,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch profile" });
  }
};

// Get user's EcoPoints history
const getEcoPointsHistory = async (req, res) => {
  try {
    const userId = req.params.id || req.user._id;

    const ecoPoints = await EcoPoint.findOne({ user: userId });

    if (!ecoPoints) {
      return res.status(200).json({
        success: true,
        ecoPoints: { totalPoints: 0, history: [] },
      });
    }

    res.status(200).json({
      success: true,
      ecoPoints,
    });
  } catch (error) {
    console.error("Error fetching EcoPoints history:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch EcoPoints history" });
  }
};

// Export all controller functions
export { getUserProfile, getEcoPointsHistory };
