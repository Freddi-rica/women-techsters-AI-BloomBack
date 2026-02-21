const Milestone = require('./Milestone.model');
const CheckIn = require('../checkin/CheckIn.model');

// GET /calendar/milestones
exports.getCalendarEvents = async (req, res, next) => {
    try {
        const milestones = await Milestone.find({ userId: req.user._id });
        const checkIns = await CheckIn.find({ userId: req.user._id });

        res.json({ success: true, data: { milestones, checkIns } });
    } catch (err) {
        next(err);
    }
};

// POST /calendar/milestones
exports.createMilestone = async (req, res, next) => {
    try {
        const { title, date, type } = req.body;
        const milestone = new Milestone({
            userId: req.user._id,
            title,
            date,
            type
        });
        await milestone.save();
        res.status(201).json({ success: true, data: milestone });
    } catch (err) {
        next(err);
    }
};

// PATCH /calendar/milestones/:id
exports.updateMilestone = async (req, res, next) => {
    try {
        const milestone = await Milestone.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { $set: req.body },
            { new: true }
        );
        if (!milestone) return res.status(404).json({ success: false, message: 'Milestone not found' });
        res.json({ success: true, data: milestone });
    } catch (err) {
        next(err);
    }
};

// DELETE /calendar/milestones/:id
exports.deleteMilestone = async (req, res, next) => {
    try {
        const milestone = await Milestone.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        if (!milestone) return res.status(404).json({ success: false, message: 'Milestone not found' });
        res.json({ success: true, message: 'Milestone deleted' });
    } catch (err) {
        next(err);
    }
};
