const express = require('express');
const router = express.Router();
const checkinController = require('./checkin.controller');
const { authRequired } = require('../../middleware/auth.middleware');

router.post('/', authRequired, checkinController.submitCheckIn);
router.get('/history', authRequired, checkinController.getHistory);
router.get('/latest', authRequired, checkinController.getLatest);
router.get('/:id', authRequired, checkinController.getCheckIn);

module.exports = router;
