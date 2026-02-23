const mongoose = require('mongoose');

const weeklyScoreSchema = new mongoose.Schema({
    week: { type: Number, required: true },
    confidence: { type: Number, required: true },
    workReadiness: { type: Number, required: true },
    emotionalWellbeing: { type: Number, required: true },
    recordedAt: { type: Date, default: Date.now }
}, { _id: false });

const progressSnapshotSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    weeklyScores: [weeklyScoreSchema],
    currentConfidence: { type: Number, default: 0 },
    currentWellbeing: { type: Number, default: 0 },
    currentWorkReadiness: { type: Number, default: 0 },
    confidenceDelta: { type: Number, default: 0 },          // % change over 6 weeks
    wellbeingDelta: { type: Number, default: 0 },
    workReadinessDelta: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('ProgressSnapshot', progressSnapshotSchema);
