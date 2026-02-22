const SuccessStory = require('./SuccessStory.model');
const User = require('../users/user_model');

// GET /stories
exports.listStories = async (req, res, next) => {
    try {
        const { filter, page = 1, limit = 10 } = req.query;
        let query = { isApproved: true };

        if (filter) {
            query.tags = { $in: [filter] };
        }

        const skip = (page - 1) * limit;
        const stories = await SuccessStory.find(query).sort({ likes: -1, createdAt: -1 }).skip(skip).limit(parseInt(limit));
        res.json({ success: true, data: stories });
    } catch (err) {
        next(err);
    }
};

// GET /stories/:id
exports.getStory = async (req, res, next) => {
    try {
        const story = await SuccessStory.findById(req.params.id);
        if (!story) return res.status(404).json({ success: false, message: 'Story not found' });
        res.json({ success: true, data: story });
    } catch (err) {
        next(err);
    }
};

// POST /stories
exports.createStory = async (req, res, next) => {
    try {
        const { role, company, leaveDuration, challenge, achievement, fullStory, tags } = req.body;
        const userId = req.user.id || req.user._id;
        const userDoc = await User.findById(userId);

        const safeTags = tags || [];

        const story = new SuccessStory({
            authorId: userId,
            authorName: userDoc ? (userDoc.fullName ? userDoc.fullName.split(' ')[0] : 'Anonymous') : 'Anonymous',
            role,
            company,
            leaveDuration,
            challenge,
            achievement,
            fullStory,
            tags: safeTags,
            isApproved: false
        });
        await story.save();
        res.status(201).json({ success: true, data: story, message: 'Story submitted and pending approval' });
    } catch (err) {
        next(err);
    }
};

// POST /stories/:id/like
exports.toggleLike = async (req, res, next) => {
    try {
        const story = await SuccessStory.findById(req.params.id);
        if (!story) return res.status(404).json({ success: false, message: 'Story not found' });

        const userId = req.user.id || req.user._id;
        const mongoose = require('mongoose');
        const userObjId = mongoose.Types.ObjectId(userId);

        const index = story.likedBy.findIndex((id) => id.toString() === userId.toString());

        if (index === -1) {
            story.likedBy.push(userId);
            story.likes += 1;
        } else {
            story.likedBy.splice(index, 1);
            story.likes -= 1;
        }

        await story.save();
        res.json({ success: true, data: { likes: story.likes, likedBy: story.likedBy } });
    } catch (err) {
        next(err);
    }
};
