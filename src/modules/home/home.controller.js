const CheckIn = require('../checkin/CheckIn.model');
const ProgressSnapshot = require('../insights/ProgressSnapshot.model');
const Resource = require('../resources/Resource.model');
const Goal = require('../goals/Goal.model');
const Milestone = require('../calendar/Milestone.model');
const SuccessStory = require('../stories/SuccessStory.model');

exports.getDashboard = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const latestCheckIn = await CheckIn.findOne({ userId }).sort({ weekNumber: -1 });

        let lastCompleted = 'Never';
        let isThisWeekDone = false;

        if (latestCheckIn) {
            const diffTime = Math.abs(new Date() - latestCheckIn.completedAt);
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            lastCompleted = diffDays === 0 ? 'Today' : `${diffDays} days ago`;
            isThisWeekDone = diffDays < 7;
        }

        const snapshot = await ProgressSnapshot.findOne({ userId });
        const snapshotData = snapshot ? {
            confidence: { score: snapshot.currentConfidence, delta: snapshot.confidenceDelta },
            emotionalWellbeing: { score: snapshot.currentWellbeing, delta: snapshot.wellbeingDelta },
            workReadiness: { score: snapshot.currentWorkReadiness, delta: snapshot.workReadinessDelta }
        } : null;

        const [resourcesCount, activeGoalsCount, upcomingMilestones, storiesCount] = await Promise.all([
            Resource.countDocuments(),
            Goal.countDocuments({ userId, isCompleted: false }),
            Milestone.countDocuments({ userId, date: { $gte: new Date() }, isCompleted: false }),
            SuccessStory.countDocuments({ isApproved: true })
        ]);

        const dashboardData = {
            user: {
                name: req.user.name || req.user.firstName || req.user.username || 'User',
                journeyStage: latestCheckIn ? latestCheckIn.journeyStage : 'preparing',
                weekNumber: latestCheckIn ? latestCheckIn.weekNumber : 1
            },
            checkIn: {
                lastCompleted,
                isThisWeekDone
            },
            snapshot: snapshotData,
            quickActions: {
                resourcesCount,
                activeGoalsCount,
                upcomingMilestones,
                storiesCount
            }
        };

        res.json({ success: true, data: dashboardData });
    } catch (err) {
        next(err);
    }
};
