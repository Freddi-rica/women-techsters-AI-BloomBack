const Goal = require('./Goal.model');

exports.getGoals = async (req, res, next) => {
    try {
        const goals = await Goal.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json({ success: true, data: goals });
    } catch (err) {
        next(err);
    }
};

exports.createGoal = async (req, res, next) => {
    try {
        const { title, category, targetCount, dueDate } = req.body;
        const goal = new Goal({
            userId: req.user._id,
            title,
            category,
            targetCount,
            dueDate,
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
        const goal = await Goal.findOne({ _id: req.params.id, userId: req.user._id });
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
        const goal = await Goal.findOne({ _id: req.params.id, userId: req.user._id });
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
        const goal = await Goal.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        if (!goal) return res.status(404).json({ success: false, message: 'Goal not found' });
        res.json({ success: true, message: 'Goal deleted' });
    } catch (err) {
        next(err);
    }
};

exports.getSuggestions = async (req, res, next) => {
    try {
        const suggestions = await Goal.find({ userId: req.user._id, isSuggested: true, isCompleted: false });
        res.json({ success: true, data: suggestions });
    } catch (err) {
        next(err);
    }
};
