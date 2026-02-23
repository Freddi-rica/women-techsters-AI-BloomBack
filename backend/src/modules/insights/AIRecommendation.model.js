const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
    priority: { type: String, enum: ['most_urgent', 'secondary', 'preventive', 'community'], required: true },
    resourceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource', required: true },
    whyThisHelps: { type: String, required: true },
    tags: [String]
}, { _id: false });

const aiRecommendationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    generatedAt: { type: Date, default: Date.now },
    nextAllowedAt: { type: Date, required: true },
    checkInsUsed: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CheckIn' }], // last 4
    recommendations: [recommendationSchema]
}, { timestamps: true });

module.exports = mongoose.model('AIRecommendation', aiRecommendationSchema);
