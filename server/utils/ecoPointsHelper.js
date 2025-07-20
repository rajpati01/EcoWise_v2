import EcoPoint from '../models/EcoPoints.js';
import User from '../models/User.js';

/**
 * Update EcoPoints for a user
 * @param {string} userId - User ID to award points to
 * @param {string} action - Type of action (must match your EcoPoint model's enum)
 * @param {number} points - Points to award
 * @param {string} description - Description of the activity
 */
const updateEcoPoints = async (userId, action, points, description = '') => {
  try {
    // Check if user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      console.error(`Cannot award points: User ${userId} not found`);
      return null;
    }
    
    console.log(`Awarding ${points} points to user ${userId} for ${action}`);
    
    // Find existing EcoPoint document or create new one
    let ecoPointsDoc = await EcoPoint.findOne({ user: userId });
    
    if (ecoPointsDoc) {
      // Update existing document
      ecoPointsDoc.totalPoints += points;
      ecoPointsDoc.history.push({
        action,
        points,
        description,
        createdAt: new Date()
      });
      await ecoPointsDoc.save();
      console.log(`Updated EcoPoints for user ${userId} to ${ecoPointsDoc.totalPoints}`);
    } else {
      // Create new document
      ecoPointsDoc = new EcoPoint({
        user: userId,
        totalPoints: points,
        history: [{
          action,
          points,
          description,
          createdAt: new Date()
        }]
      });
      await ecoPointsDoc.save();
      console.log(`Created new EcoPoints record for user ${userId}`);
    }
    
    // Also update the user's ecoPoints field
    await User.findByIdAndUpdate(userId, {
      $inc: { ecoPoints: points }
    });
    
    return ecoPointsDoc;
  } catch (error) {
    console.error(`Error awarding points:`, error);
    throw error;
  }
};

export default updateEcoPoints;