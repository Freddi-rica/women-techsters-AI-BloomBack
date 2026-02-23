const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendEmail } = require("../../config/mailer");

function makeOtp() {
    return String(Math.floor(100000 + Math.random() * 900000)); // 6 digits
}

async function hashValue(value) {
    const saltRounds = 10;
    return bcrypt.hash(value, saltRounds);
}

async function compareValue(value, hash) {
    return bcrypt.compare(value, hash);
}

function signToken(user) {
    return jwt.sign(
        { sub: user._id.toString(), email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );
}

function makeResetToken() {
    return crypto.randomBytes(32).toString("hex"); // 64 chars
}

async function sendOtpEmail({ to, code, purpose }) {
    const title = purpose === "verify" ? "Verify your BloomBack account" : "Reset your BloomBack password";
    const html = `
    <div style="font-family: Arial; line-height:1.5;">
      <h2>${title}</h2>
      <p>Your code is:</p>
      <h1 style="letter-spacing:4px;">${code}</h1>
      <p>This code expires in ${process.env.OTP_EXPIRES_MIN || 10} minutes.</p>
    </div>
  `;
    await sendEmail({ to, subject: title, html });
}

module.exports = {
    makeOtp,
    hashValue,
    compareValue,
    signToken,
    makeResetToken,
    sendOtpEmail,
};
