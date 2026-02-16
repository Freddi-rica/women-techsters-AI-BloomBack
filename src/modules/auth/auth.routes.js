const router = require("express").Router();
const ctrl = require("./auth.controller");
const { authRequired } = require("../../middleware/auth.middleware");


router.post("/signup", ctrl.signup);
router.post("/verify-email", ctrl.verifyEmail);
router.post("/resend-verification-code", ctrl.resendVerificationCode);
router.post("/login", ctrl.login);

router.post("/forgot-password", ctrl.forgotPassword);
router.post("/verify-reset-code", ctrl.verifyResetCode);
router.post("/reset-password", ctrl.resetPassword);
router.post("/change-password", authRequired, ctrl.changePassword);


module.exports = router;



