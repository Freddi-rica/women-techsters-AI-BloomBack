const mongoose = require('mongoose');

const checkInSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    weekNumber: { type: Number, required: true },               // e.g. 6
    journeyStage: { type: String, enum: ['preparing', 'on_leave', 'returning'], required: true },
    responses: {
        confidence: { type: Number, min: 1, max: 5 },
        emotionalWellbeing: { type: Number, min: 1, max: 5 },
        workReadiness: { type: Number, min: 1, max: 5 },
        supportNeeds: [String],         // e.g. ['Career guidance', 'Peer connections']
        biggestChallenge: String        // e.g. 'Reconnecting with team'
    },
    completedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('CheckIn', checkInSchema);
