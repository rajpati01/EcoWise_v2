import mongoose from 'mongoose';

const wasteClassificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  imageUrl: { type: String, required: true },
  category: { type: String, required: true },
  confidence: { type: Number, required: true },
  pointsEarned: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

// export default mongoose.model('WasteClassification', wasteClassificationSchema);

// Connect to the existing collection
const wasteClassification = mongoose.models.WasteCollection || 
  mongoose.model('WasteClassification', wasteClassificationSchema, 'WasteClassification');

export default wasteClassification;