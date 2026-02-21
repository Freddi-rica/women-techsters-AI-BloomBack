const ProgressSnapshot = require('./ProgressSnapshot.model');
const { generateKeyInsights } = require('./progressCalculation.service');

// GET /insights/snapshot
exports.getSnapshot = async (req, res, next) => {
    try {
        const snapshot = await ProgressSnapshot.findOne({ userId: req.user._id });
        if (!snapshot) return res.status(404).json({ success: false, message: 'Snapshot not found' });

        res.json({
            success: true,
            data: {
                confidence: { score: snapshot.currentConfidence, delta: snapshot.confidenceDelta },
                emotionalWellbeing: { score: snapshot.currentWellbeing, delta: snapshot.wellbeingDelta },
                workReadiness: { score: snapshot.currentWorkReadiness, delta: snapshot.workReadinessDelta }
            }
        });
    } catch (err) {
        next(err);
    }
};

// GET /insights/trends
exports.getTrends = async (req, res, next) => {
    try {
        const snapshot = await ProgressSnapshot.findOne({ userId: req.user._id });
        if (!snapshot) return res.status(404).json({ success: false, message: 'Snapshot not found' });

        const weeks = snapshot.weeklyScores.map(ws => ({
            week: ws.week,
            confidence: ws.confidence,
            workReadiness: ws.workReadiness,
            wellbeing: ws.emotionalWellbeing
        }));

        res.json({ success: true, data: { weeks } });
    } catch (err) {
        next(err);
    }
};

// GET /insights/key-insights
exports.getKeyInsights = async (req, res, next) => {
    try {
        const snapshot = await ProgressSnapshot.findOne({ userId: req.user._id });
        const insights = generateKeyInsights(snapshot);
        res.json({ success: true, data: insights });
    } catch (err) {
        next(err);
    }
};
