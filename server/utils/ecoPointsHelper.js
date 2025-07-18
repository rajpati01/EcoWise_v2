import EcoPoint from "../models/EcoPoints.js";
import User from "../models/user.js";

/**
 * Update a user's EcoPoints for any action
 * @param {string} userId - User's MongoDB ID
 * @param {string} action - Type of action (classification, article, campaign, comment, join_campaign, publish_blog, comment_blog)
 * @param {number} points - Points to award
 * @param {string} description - Description of the action
 * @returns {Promise} Updated EcoPoint document
 */
const updateEcoPoints = async (userId, action, points, description) => {
  try {
    console.log(
      `Updating EcoPoints for user ${userId}: ${points} points for ${action}`
    );

    // Find the user's EcoPoints document or create if it doesn't exist
    let userEcoPoints = await EcoPoint.findOne({ user: userId });

    if (!userEcoPoints) {
      userEcoPoints = new EcoPoint({
        user: userId,
        totalPoints: 0,
        history: [],
      });
    }

    // Update points and add to history
    userEcoPoints.totalPoints += points;
    userEcoPoints.history.push({
      action,
      points,
      description,
      createdAt: new Date(),
    });

    // Save and return the updated document
    await userEcoPoints.save();
    console.log(
      `EcoPoints document saved with new total: ${userEcoPoints.totalPoints}`
    );

    // Also update the user's ecoPoints field for quick access
    const user = await User.findByIdAndUpdate(
      userId, 
      { $inc: { ecoPoints: points } },
      { new: true }
    );
    
    console.log(`User document updated with +${points} ecoPoints`);
    
    // Update user level based on points if user was found
    if (user) {
      // Calculate new level based on total points
      let newLevel = 'Beginner';
      if (user.ecoPoints >= 1000) {
        newLevel = 'Eco Master';
      } else if (user.ecoPoints >= 500) {
        newLevel = 'Eco Champion';
      } else if (user.ecoPoints >= 200) {
        newLevel = 'Eco Warrior';
      } else if (user.ecoPoints >= 50) {
        newLevel = 'Eco Explorer';
      }
      
      // Update level if it changed
      if (user.level !== newLevel) {
        user.level = newLevel;
        await user.save();
        console.log(`User level updated to: ${newLevel}`);
      }
    }

    return userEcoPoints;
  } catch (error) {
    console.error("Error updating EcoPoints:", error);
    throw error;
  }
};

export default updateEcoPoints;