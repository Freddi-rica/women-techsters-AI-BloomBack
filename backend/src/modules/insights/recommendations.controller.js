const AIRecommendation = require('./AIRecommendation.model');
const CheckIn = require('../checkin/CheckIn.model');
const { generateAIRecommendation } = require('./aiRecommendation.service');

exports.generateRecommendations = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const checkIns = await CheckIn.find({ userId }).sort({ weekNumber: -1 }).limit(4);
        if (checkIns.length < 2) {
            return res.status(400).json({ success: false, message: 'At least 2 check-ins required to generate recommendations' });
        }

        const latestRec = await AIRecommendation.findOne({ userId }).sort({ generatedAt: -1 });
        if (latestRec && latestRec.nextAllowedAt > new Date()) {
            return res.status(400).json({ success: false, message: 'You can only generate recommendations again after 7 days' });
        }

        const recommendations = await generateAIRecommendation(req.user, checkIns);

        const nextAllowedAt = new Date();
        nextAllowedAt.setDate(nextAllowedAt.getDate() + 7);

        const recDoc = new AIRecommendation({
            userId,
            nextAllowedAt,
            checkInsUsed: checkIns.map(c => c._id),
            recommendations
        });
        await recDoc.save();

        res.status(201).json({ success: true, data: recDoc });
    } catch (err) {
        next(err);
    }
};

exports.getLatestRecommendations = async (req, res, next) => {
    try {
        const recDoc = await AIRecommendation.findOne({ userId: req.user._id })
            .sort({ generatedAt: -1 })
            .populate('recommendations.resourceId');

        if (!recDoc) return res.status(404).json({ success: false, message: 'No recommendations found' });

        const formattedRecs = recDoc.recommendations.map(r => ({
            priority: r.priority,
            resource: r.resourceId,
            whyThisHelps: r.whyThisHelps
        }));

        res.json({
            success: true,
            data: {
                generatedAt: recDoc.generatedAt,
                nextAllowedAt: recDoc.nextAllowedAt,
                recommendations: formattedRecs
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.checkCanGenerate = async (req, res, next) => {
    try {
        const checkInsCount = await CheckIn.countDocuments({ userId: req.user._id });
        const latestRec = await AIRecommendation.findOne({ userId: req.user._id }).sort({ generatedAt: -1 });

        let canGenerate = true;
        let reason = null;

        if (checkInsCount < 2) {
            canGenerate = false;
            reason = 'need_more_checkins';
        } else if (latestRec && latestRec.nextAllowedAt > new Date()) {
            canGenerate = false;
            reason = 'cooldown_active';
        }

        res.json({ success: true, data: { canGenerate, reason, nextAllowedAt: latestRec?.nextAllowedAt } });
    } catch (err) {
        next(err);
    }
};
