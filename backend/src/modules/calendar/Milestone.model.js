const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    date: { type: Date, required: true },
    type: { type: String, required: true },
    isCompleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Milestone', milestoneSchema);
