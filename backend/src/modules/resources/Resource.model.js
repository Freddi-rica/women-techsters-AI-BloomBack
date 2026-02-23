const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, enum: ['article', 'video', 'guide', 'podcast'], required: true },
    readTime: String,                 // e.g. "5 min read"
    source: String,                   // e.g. "Bloom Library", "Harvard Business Review"
    tags: [String],                   // e.g. ['Confidence', 'Returning', 'Mindset']
    description: String,
    url: String,
    relatedResources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resource' }],
    completedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],          // track completions
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Resource', resourceSchema);
