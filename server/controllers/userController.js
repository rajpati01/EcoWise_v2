import User from '../models/User.js';
import Campaign from '../models/Campaign.js';

export const getMyProfile = async (req, res) => {
  try {
    const user = await User.find().select('-password');
    // Find campaigns where this user is a participant
    const joinedCampaigns = await Campaign.find({ participants: req.user._id });
    res.json({ ...user.toObject(), joinedCampaigns });
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile" });
  }
};