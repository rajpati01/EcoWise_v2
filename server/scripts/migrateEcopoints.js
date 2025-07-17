exports.getLeaderboard = async (req, res) => {
  try {
    // Get top users by EcoPoints
    const topUsers = await EcoPoint.find()
      .sort({ totalPoints: -1 })
      .limit(20)
      .populate('user', 'name email profileImage');
    
    res.render('leaderboard', { topUsers });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Server error' });
  }
};