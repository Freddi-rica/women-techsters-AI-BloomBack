const mongoose = require('mongoose');

const successStorySchema = new mongoose.Schema({
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    authorName: { type: String, required: true },
    role: String,                     // e.g. "UI/UX Designer"
    company: String,
    leaveDuration: String,            // e.g. "6 months maternity leave"
    challenge: String,
    achievement: String,
    fullStory: { type: String, required: true },
    tags: [String],                   // e.g. ['Promotion', 'Confidence', 'Tech']
    likes: { type: Number, default: 0 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isApproved: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('SuccessStory', successStorySchema);
