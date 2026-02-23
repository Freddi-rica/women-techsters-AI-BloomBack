const router = require("express").Router();
const { authRequired } = require("../../middleware/auth.middleware");
const ctrl = require("./user_controller");

router.get("/me", authRequired, ctrl.me);
router.patch("/me", authRequired, ctrl.updateMe);
router.post("/me/clear-data", authRequired, ctrl.clearData);
router.delete("/me", authRequired, ctrl.deleteMe);


module.exports = router;
