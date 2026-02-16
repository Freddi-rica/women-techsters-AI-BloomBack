const User = require("../users/user_model");
const { changePasswordSchema } = require("./auth.schema");


const {
    signupSchema,
    loginSchema,
    otpSchema,
    resendSchema,
    forgotSchema,
    verifyResetSchema,
    resetPasswordSchema,
} = require("./auth.schema");

const {
    makeOtp,
    hashValue,
    compareValue,
    signToken,
    makeResetToken,
    sendOtpEmail,
} = require("./auth.service");

function apiError(res, code, message, status = 400) {
    return res.status(status).json({ success: false, error: { code, message } });
}

function apiOk(res, data, status = 200) {
    return res.status(status).json({ success: true, data });
}

const otpMinutes = Number(process.env.OTP_EXPIRES_MIN || 10);

exports.signup = async (req, res) => {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) {
        return apiError(res, "VALIDATION_ERROR", parsed.error.issues[0].message);
    }

    const { fullName, email, password, journeyStage } = parsed.data;

    const existing = await User.findOne({ email });
    if (existing) {
        return apiError(res, "EMAIL_EXISTS", "Email already registered");
    }

    const passwordHash = await hashValue(password);

    const otp = makeOtp();
    const verifyOtpHash = await hashValue(otp);
    const verifyOtpExpiresAt = new Date(Date.now() + otpMinutes * 60 * 1000);

    const user = await User.create({
        fullName,
        email,
        passwordHash,
        journeyStage,
        isVerified: false,
        verifyOtpHash,
        verifyOtpExpiresAt,
    });

    await sendOtpEmail({ to: email, code: otp, purpose: "verify" });

    return apiOk(res, { message: "Signup successful. Verification code sent.", userId: user._id }, 201);
};

exports.verifyEmail = async (req, res) => {
    const parsed = otpSchema.safeParse(req.body);
    if (!parsed.success) return apiError(res, "VALIDATION_ERROR", "Invalid request");

    const { email, code } = parsed.data;

    const user = await User.findOne({ email });
    if (!user) return apiError(res, "INCORRECT_EMAIL", "The Email Address is incorrect!", 404);

    if (user.isVerified) {
        return apiOk(res, { message: "Account already verified." });
    }

    if (!user.verifyOtpHash || !user.verifyOtpExpiresAt || user.verifyOtpExpiresAt < new Date()) {
        return apiError(res, "OTP_EXPIRED", "Code expired. Please resend code.");
    }

    const ok = await compareValue(code, user.verifyOtpHash);
    if (!ok) return apiError(res, "INVALID_OTP", "The confirmation code is incorrect!");

    user.isVerified = true;
    user.verifyOtpHash = undefined;
    user.verifyOtpExpiresAt = undefined;
    await user.save();

    return apiOk(res, { message: "Account verified successfully." });
};

exports.resendVerificationCode = async (req, res) => {
    const parsed = resendSchema.safeParse(req.body);
    if (!parsed.success) return apiError(res, "VALIDATION_ERROR", "Invalid request");

    const { email } = parsed.data;
    const user = await User.findOne({ email });
    if (!user) return apiError(res, "INCORRECT_EMAIL", "The Email Address is incorrect!", 404);

    if (user.isVerified) return apiOk(res, { message: "Account already verified." });

    const otp = makeOtp();
    user.verifyOtpHash = await hashValue(otp);
    user.verifyOtpExpiresAt = new Date(Date.now() + otpMinutes * 60 * 1000);
    await user.save();

    await sendOtpEmail({ to: email, code: otp, purpose: "verify" });

    return apiOk(res, { message: "Verification code resent." });
};

exports.login = async (req, res) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) return apiError(res, "VALIDATION_ERROR", "Invalid request");

    const { email, password } = parsed.data;

    const user = await User.findOne({ email });
    if (!user) return apiError(res, "INCORRECT_EMAIL", "The Email Address is incorrect!", 404);

    const ok = await compareValue(password, user.passwordHash);
    if (!ok) return apiError(res, "INCORRECT_PASSWORD", "The Password is incorrect!", 401);

    if (!user.isVerified) return apiError(res, "UNVERIFIED_ACCOUNT", "Please verify your account first.", 403);

    const token = signToken(user);

    return apiOk(res, {
        accessToken: token,
        user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            journeyStage: user.journeyStage,
            isVerified: user.isVerified,
        },
    });
};

exports.forgotPassword = async (req, res) => {
    const parsed = forgotSchema.safeParse(req.body);
    if (!parsed.success) return apiError(res, "VALIDATION_ERROR", "Invalid request");

    const { email } = parsed.data;

    const user = await User.findOne({ email });
    // For security, you could always return success. For your UI, this is fine:
    if (!user) return apiOk(res, { message: "If the email exists, a code has been sent." });

    const otp = makeOtp();
    user.resetOtpHash = await hashValue(otp);
    user.resetOtpExpiresAt = new Date(Date.now() + otpMinutes * 60 * 1000);
    await user.save();

    await sendOtpEmail({ to: email, code: otp, purpose: "reset" });

    return apiOk(res, { message: "Reset code sent." });
};

exports.verifyResetCode = async (req, res) => {
    const parsed = verifyResetSchema.safeParse(req.body);
    if (!parsed.success) return apiError(res, "VALIDATION_ERROR", "Invalid request");

    const { email, code } = parsed.data;

    const user = await User.findOne({ email });
    if (!user) return apiError(res, "INCORRECT_EMAIL", "The Email Address is incorrect!", 404);

    if (!user.resetOtpHash || !user.resetOtpExpiresAt || user.resetOtpExpiresAt < new Date()) {
        return apiError(res, "OTP_EXPIRED", "Code expired. Please resend code.");
    }

    const ok = await compareValue(code, user.resetOtpHash);
    if (!ok) return apiError(res, "INVALID_OTP", "The confirmation code is incorrect!");

    // Issue a reset token (safer than sending OTP again)
    const resetToken = makeResetToken();
    user.resetTokenHash = await hashValue(resetToken);
    user.resetTokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
    user.resetOtpHash = undefined;
    user.resetOtpExpiresAt = undefined;
    await user.save();

    return apiOk(res, { resetToken });
};

exports.resetPassword = async (req, res) => {
    const parsed = resetPasswordSchema.safeParse(req.body);
    if (!parsed.success) return apiError(res, "VALIDATION_ERROR", parsed.error.issues[0].message);

    const { resetToken, newPassword } = parsed.data;

    const user = await User.findOne({ resetTokenExpiresAt: { $gt: new Date() } });
    if (!user || !user.resetTokenHash) return apiError(res, "INVALID_RESET", "Reset session expired. Try again.");

    const ok = await compareValue(resetToken, user.resetTokenHash);
    if (!ok) return apiError(res, "INVALID_RESET", "Reset session expired. Try again.");

    user.passwordHash = await hashValue(newPassword);
    user.resetTokenHash = undefined;
    user.resetTokenExpiresAt = undefined;
    await user.save();

    return apiOk(res, { message: "Password reset successfully." });
};

exports.changePassword = async (req, res) => {
    const parsed = changePasswordSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            success: false,
            error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0].message },
        });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
        return res.status(404).json({
            success: false,
            error: { code: "NOT_FOUND", message: "User not found" },
        });
    }

    const ok = await compareValue(parsed.data.currentPassword, user.passwordHash);
    if (!ok) {
        return res.status(401).json({
            success: false,
            error: { code: "INCORRECT_PASSWORD", message: "Current password is incorrect" },
        });
    }

    user.passwordHash = await hashValue(parsed.data.newPassword);
    await user.save();

    return res.json({
        success: true,
        data: { message: "Password changed successfully." },
    });
};
