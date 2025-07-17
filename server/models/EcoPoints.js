import mongoose from 'mongoose';

const ecoPointHistorySchema = new mongoose.Schema({
  action: {
    type: String,
    enum: ['classification', 'article', 'campaign', 'comment', 'join_campaign'],
    required: true
  },
  points: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const ecoPointSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true  // This ensures one EcoPoints document per user
  },
  totalPoints: {
    type: Number,
    default: 0
  },
  history: [ecoPointHistorySchema]
}, { timestamps: true });

// Check if the model already exists before compiling it again
const EcoPoint = mongoose.models.EcoPoint || mongoose.model('EcoPoint', ecoPointSchema);

export default EcoPoint;