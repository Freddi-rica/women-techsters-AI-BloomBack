const Goal = require('./Goal.model');

exports.getGoals = async (req, res, next) => {
    try {
        const userId = req.user.id || req.user._id;
        const goals = await Goal.find({ userId }).sort({ createdAt: -1 });
        res.json({ success: true, data: goals });
    } catch (err) {
        next(err);
    }
};

exports.createGoal = async (req, res, next) => {
    try {
        const { title, category, targetCount, targetValue, dueDate, deadline } = req.body;
        const userId = req.user.id || req.user._id;

        const validEnums = ['engagement', 'learning', 'community', 'career', 'personal'];
        const mappedCat = (category && validEnums.includes(category.toLowerCase())) ? category.toLowerCase() : 'personal';

        const goal = new Goal({
            userId: userId,
            title,
            category: mappedCat,
            targetCount: targetValue || targetCount || 1,
            dueDate: deadline || dueDate,
            isSuggested: false
        });
        await goal.save();
        res.status(201).json({ success: true, data: goal });
    } catch (err) {
        next(err);
    }
};

exports.incrementProgress = async (req, res, next) => {
    try {
        const userId = req.user.id || req.user._id;
        const goal = await Goal.findOne({ _id: req.params.id, userId });
        if (!goal) return res.status(404).json({ success: false, message: 'Goal not found' });

        goal.currentCount += 1;
        if (goal.currentCount >= goal.targetCount) {
            goal.isCompleted = true;
            goal.completedAt = new Date();
        }
        await goal.save();

        res.json({ success: true, data: goal });
    } catch (err) {
        next(err);
    }
};

exports.completeGoal = async (req, res, next) => {
    try {
        const userId = req.user.id || req.user._id;
        const goal = await Goal.findOne({ _id: req.params.id, userId });
        if (!goal) return res.status(404).json({ success: false, message: 'Goal not found' });

        goal.isCompleted = true;
        goal.completedAt = new Date();
        goal.currentCount = goal.targetCount;
        await goal.save();

        res.json({ success: true, data: goal });
    } catch (err) {
        next(err);
    }
};

exports.deleteGoal = async (req, res, next) => {
    try {
        const userId = req.user.id || req.user._id;
        const goal = await Goal.findOneAndDelete({ _id: req.params.id, userId });
        if (!goal) return res.status(404).json({ success: false, message: 'Goal not found' });
        res.json({ success: true, message: 'Goal deleted' });
    } catch (err) {
        next(err);
    }
};

exports.getSuggestions = async (req, res, next) => {
    try {
        const userId = req.user.id || req.user._id;
        const suggestions = await Goal.find({ userId, isSuggested: true, isCompleted: false });
        res.json({ success: true, data: suggestions });
    } catch (err) {
        next(err);
    }
};
