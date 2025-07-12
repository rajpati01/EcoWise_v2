import EcoPoints from '../models/ecopoints.js'

// Create or Update Points
export const addPoints = async (req, res) => {
  const { userId, points, action, description } = req.body;

  if (!userId || !points || !action) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    let ecoPoints = await EcoPoints.findOne({ user: userId });

    if (!ecoPoints) {
      ecoPoints = new EcoPoints({
        user: userId,
        totalPoints: points,
        history: [{ action, points, description }],
      });
    } else {
      ecoPoints.totalPoints += points;
      ecoPoints.history.unshift({ action, points, description });
    }

    await ecoPoints.save();
    res.status(200).json(ecoPoints);
  } catch (error) {
    res.status(500).json({ message: "Error updating eco points", error });
  }
};

// Get EcoPoints by user
export const getUserEcoPoints = async (req, res) => {
  const userId = req.params.userId;

  try {
    const ecoPoints = await EcoPoints.findOne({ user: userId }).populate("user", "name email");

    if (!ecoPoints) {
      return res.status(404).json({ message: "EcoPoints not found for user" });
    }

    res.status(200).json(ecoPoints);
  } catch (error) {
    res.status(500).json({ message: "Error fetching eco points", error });
  }
};
