const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    category: { type: String, enum: ['engagement', 'learning', 'community', 'career', 'personal'], required: true },
    targetCount: { type: Number, default: 1 },
    currentCount: { type: Number, default: 0 },
    dueDate: Date,
    isCompleted: { type: Boolean, default: false },
    completedAt: Date,
    isSuggested: { type: Boolean, default: false }, // system-suggested vs user-created
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Goal', goalSchema);
