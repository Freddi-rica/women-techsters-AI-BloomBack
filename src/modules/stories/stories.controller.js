const SuccessStory = require('./SuccessStory.model');

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
        const story = new SuccessStory({
            authorId: req.user._id,
            authorName: req.user.name || req.user.firstName || req.user.username || 'Anonymous',
            role,
            company,
            leaveDuration,
            challenge,
            achievement,
            fullStory,
            tags,
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

        const userId = req.user._id;
        const index = story.likedBy.indexOf(userId);

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
