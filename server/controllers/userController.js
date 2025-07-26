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

export const getProfile = async (req, res) => {
  try {
    // req.user should be set by your protect middleware
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};