const express = require('express');
const router = express.Router();
const goalsController = require('./goals.controller');
const { authRequired } = require('../../middleware/auth.middleware');

router.get('/', authRequired, goalsController.getGoals);
router.post('/', authRequired, goalsController.createGoal);
router.get('/suggestions', authRequired, goalsController.getSuggestions); // Must be before /:id
router.patch('/:id/progress', authRequired, goalsController.incrementProgress);
router.patch('/:id/complete', authRequired, goalsController.completeGoal);
router.delete('/:id', authRequired, goalsController.deleteGoal);

module.exports = router;
