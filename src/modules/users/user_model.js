const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },

        passwordHash: { type: String, required: true },
        isVerified: { type: Boolean, default: false },

        journeyStage: {
            type: String,
            enum: ["preparing", "on_leave", "returning"],
            default: "preparing",
        },

        // OTP for email verification
        verifyOtpHash: { type: String },
        verifyOtpExpiresAt: { type: Date },

        // OTP for password reset
        resetOtpHash: { type: String },
        resetOtpExpiresAt: { type: Date },
        resetTokenHash: { type: String },
        resetTokenExpiresAt: { type: Date },

        // Profile fields
        category: { type: String, default: null },
        jobRole: { type: String, default: null },
        industry: { type: String, default: null },

        // Notifications
        notificationSettings: {
            checkInReminders: { type: Boolean, default: true },
            journeyTips: { type: Boolean, default: true },
            communityUpdates: { type: Boolean, default: true },
            insightsDigest: { type: Boolean, default: true },
            soundsVibrations: { type: Boolean, default: true },
            checkInFrequency: {
                type: String,
                enum: ["once_weekly", "twice_weekly"],
                default: "once_weekly",
            },
            journeyTipsFrequency: {
                type: String,
                enum: ["once_weekly", "twice_weekly"],
                default: "once_weekly",
            },
        },

        // Privacy
        privacySettings: {
            anonymousPosting: { type: Boolean, default: false },
        },

        // Optional (for "Progress Activity" later)
        progressActivity: { type: Array, default: [] },


    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
