const Resource = require('./Resource.model');
const UserResource = require('./UserResource.model');

// GET /resources
exports.listResources = async (req, res, next) => {
    try {
        const { type, tags, q, page = 1, limit = 10 } = req.query;
        let query = {};

        if (type) query.type = type;
        if (tags) query.tags = { $in: tags.split(',') };
        if (q) {
            query.$or = [
                { title: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } },
                { tags: { $regex: q, $options: 'i' } }
            ];
        }

        const skip = (page - 1) * limit;
        const resources = await Resource.find(query).skip(skip).limit(parseInt(limit));

        res.json({ success: true, data: resources });
    } catch (err) {
        next(err);
    }
};

exports.searchResources = exports.listResources;

// GET /resources/saved
exports.getSavedResources = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        const userId = req.user.id || req.user._id;
        const saved = await UserResource.find({ userId, savedAt: { $ne: null } })
            .populate('resourceId')
            .skip(skip)
            .limit(parseInt(limit));

        res.json({ success: true, data: saved });
    } catch (err) {
        next(err);
    }
};

// GET /resources/:id
exports.getResource = async (req, res, next) => {
    try {
        const resource = await Resource.findById(req.params.id).populate('relatedResources');
        if (!resource) return res.status(404).json({ success: false, message: 'Resource not found' });

        res.json({ success: true, data: resource });
    } catch (err) {
        next(err);
    }
};

// POST /resources/:id/complete
exports.completeResource = async (req, res, next) => {
    try {
        const resourceId = req.params.id;
        const userId = req.user.id || req.user._id;

        const resource = await Resource.findById(resourceId);
        if (!resource) return res.status(404).json({ success: false, message: 'Resource not found' });

        if (!resource.completedBy.includes(userId)) {
            resource.completedBy.push(userId);
            await resource.save();
        }

        let userRes = await UserResource.findOne({ userId, resourceId });
        if (!userRes) {
            userRes = new UserResource({ userId, resourceId });
        }
        userRes.completedAt = new Date();
        await userRes.save();

        res.json({ success: true, message: 'Resource marked as completed' });
    } catch (err) {
        next(err);
    }
};

// POST /resources/:id/save
exports.saveResource = async (req, res, next) => {
    try {
        const resourceId = req.params.id;
        const userId = req.user.id || req.user._id;

        let userRes = await UserResource.findOne({ userId, resourceId });
        if (!userRes) {
            userRes = new UserResource({ userId, resourceId });
        }
        userRes.savedAt = new Date();
        await userRes.save();

        res.json({ success: true, message: 'Resource saved' });
    } catch (err) {
        next(err);
    }
};
