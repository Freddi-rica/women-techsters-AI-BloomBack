const { z } = require("zod");

const email = z.string().email();
const password = z
    .string()
    .min(8)
    .regex(/[A-Z]/, "Must contain at least 1 uppercase letter")
    .regex(/\d/, "Must contain at least 1 number");

const journeyStage = z.enum(["preparing", "on_leave", "returning"]);

const signupSchema = z.object({
    fullName: z.string().min(2),
    email,
    password,
    journeyStage,
});

const loginSchema = z.object({
    email,
    password: z.string().min(1),
});

const otpSchema = z.object({
    email,
    code: z.string().length(6),
});

const resendSchema = z.object({
    email,
});

const forgotSchema = z.object({
    email,
});

const verifyResetSchema = z.object({
    email,
    code: z.string().length(6),
});

const resetPasswordSchema = z.object({
    resetToken: z.string().min(20),
    newPassword: password,
});
const changePasswordSchema = z.object({
    currentPassword: z.string().min(1),
    newPassword: password, // uses your strong rules (uppercase + number + 8+)
});

module.exports = {
    signupSchema,
    loginSchema,
    otpSchema,
    resendSchema,
    forgotSchema,
    verifyResetSchema,
    resetPasswordSchema,
    changePasswordSchema,
};
