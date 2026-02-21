const express = require('express');
const router = express.Router();
const calendarController = require('./calendar.controller');
const { authRequired } = require('../../middleware/auth.middleware');

router.get('/milestones', authRequired, calendarController.getCalendarEvents);
router.post('/milestones', authRequired, calendarController.createMilestone);
router.patch('/milestones/:id', authRequired, calendarController.updateMilestone);
router.delete('/milestones/:id', authRequired, calendarController.deleteMilestone);

module.exports = router;
