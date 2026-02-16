const { z } = require("zod");
const User = require("./user_model");

const journeyStage = z.enum(["preparing", "on_leave", "returning"]);

const notificationSettingsSchema = z.object({
    checkInReminders: z.boolean().optional(),
    journeyTips: z.boolean().optional(),
    communityUpdates: z.boolean().optional(),
    insightsDigest: z.boolean().optional(),
    soundsVibrations: z.boolean().optional(),
    checkInFrequency: z.enum(["once_weekly", "twice_weekly"]).optional(),
    journeyTipsFrequency: z.enum(["once_weekly", "twice_weekly"]).optional(),
}).optional();

const privacySettingsSchema = z.object({
    anonymousPosting: z.boolean().optional(),
}).optional();

const updateSchema = z.object({
    fullName: z.string().min(2).optional(),
    journeyStage: z.enum(["preparing", "on_leave", "returning"]).optional(),

    category: z.string().min(2).optional().nullable(),
    jobRole: z.string().min(2).optional().nullable(),
    industry: z.string().min(2).optional().nullable(),

    notificationSettings: z
        .object({
            checkInReminders: z.boolean().optional(),
            journeyTips: z.boolean().optional(),
            communityUpdates: z.boolean().optional(),
            insightsDigest: z.boolean().optional(),
            soundsVibrations: z.boolean().optional(),
            checkInFrequency: z.enum(["once_weekly", "twice_weekly"]).optional(),
            journeyTipsFrequency: z.enum(["once_weekly", "twice_weekly"]).optional(),
        })
        .optional(),

    privacySettings: z
        .object({
            anonymousPosting: z.boolean().optional(),
        })
        .optional(),
});

exports.me = async (req, res) => {
    const user = await User.findById(req.user.id).select("-passwordHash -verifyOtpHash -resetOtpHash -resetTokenHash");
    return res.json({ success: true, data: user });
};

exports.updateMe = async (req, res) => {
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: "Invalid input" } });
    }

    const updated = await User.findByIdAndUpdate(
        req.user.id,
        { $set: parsed.data },
        { new: true }
    ).select("-passwordHash -verifyOtpHash -resetOtpHash -resetTokenHash");

    return res.json({ success: true, data: updated });
};

exports.clearData = async (req, res) => {
    await User.findByIdAndUpdate(req.user.id, {
        $set: {
            progressActivity: [],
        },
    });

    return res.json({
        success: true,
        data: { message: "Data cleared successfully." },
    });
};

exports.deleteMe = async (req, res) => {
    await User.findByIdAndDelete(req.user.id);
    return res.json({ success: true, data: { message: "Account deleted." } });
};
