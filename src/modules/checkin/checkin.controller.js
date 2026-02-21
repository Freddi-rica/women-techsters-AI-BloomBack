const CheckIn = require('./CheckIn.model');
const Goal = require('../goals/Goal.model');
const { updateProgressSnapshot, generateKeyInsights } = require('../insights/progressCalculation.service');
const { generateGoalSuggestions } = require('../goals/goalSuggestion.service');

// POST /checkin
exports.submitCheckIn = async (req, res, next) => {
    try {
        const { weekNumber, journeyStage, responses } = req.body;
        const userId = req.user._id;

        const existing = await CheckIn.findOne({ userId, weekNumber });
        if (existing) {
            return res.status(400).json({ success: false, message: 'Check-in for this week already exists' });
        }

        const checkIn = new CheckIn({ userId, weekNumber, journeyStage, responses });
        await checkIn.save();

        const snapshot = await updateProgressSnapshot(userId, weekNumber, responses);

        const goals = await Goal.find({ userId, category: 'engagement', isCompleted: false });
        for (const goal of goals) {
            goal.currentCount += 1;
            if (goal.currentCount >= goal.targetCount) {
                goal.isCompleted = true;
                goal.completedAt = new Date();
            }
            await goal.save();
        }

        await generateGoalSuggestions(userId, responses);

        const insights = generateKeyInsights(snapshot);

        res.status(201).json({
            success: true,
            data: {
                checkIn,
                snapshot,
                keyInsights: insights
            }
        });
    } catch (err) {
        next(err);
    }
};

// GET /checkin/history
exports.getHistory = async (req, res, next) => {
    try {
        const checkIns = await CheckIn.find({ userId: req.user._id }).sort({ weekNumber: 1 });
        res.json({ success: true, data: checkIns });
    } catch (err) {
        next(err);
    }
};

// GET /checkin/latest
exports.getLatest = async (req, res, next) => {
    try {
        const checkIn = await CheckIn.findOne({ userId: req.user._id }).sort({ weekNumber: -1 });
        if (!checkIn) {
            return res.status(404).json({ success: false, message: 'No check-in found' });
        }
        res.json({ success: true, data: checkIn });
    } catch (err) {
        next(err);
    }
};

// GET /checkin/:id
exports.getCheckIn = async (req, res, next) => {
    try {
        const checkIn = await CheckIn.findOne({ _id: req.params.id, userId: req.user._id });
        if (!checkIn) {
            return res.status(404).json({ success: false, message: 'Check-in not found' });
        }
        res.json({ success: true, data: checkIn });
    } catch (err) {
        next(err);
    }
};
