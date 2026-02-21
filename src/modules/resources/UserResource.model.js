const mongoose = require('mongoose');

const userResourceSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    resourceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource', required: true },
    completedAt: Date,
    savedAt: Date
}, { timestamps: true });

module.exports = mongoose.model('UserResource', userResourceSchema);
