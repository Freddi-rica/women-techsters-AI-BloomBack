const express = require('express');
const router = express.Router();
const insightsController = require('./insights.controller');
const recommendationsController = require('./recommendations.controller');
const { authRequired } = require('../../middleware/auth.middleware');

router.get('/snapshot', authRequired, insightsController.getSnapshot);
router.get('/trends', authRequired, insightsController.getTrends);
router.get('/key-insights', authRequired, insightsController.getKeyInsights);

router.post('/recommendations/generate', authRequired, recommendationsController.generateRecommendations);
router.get('/recommendations/latest', authRequired, recommendationsController.getLatestRecommendations);
router.get('/recommendations/can-generate', authRequired, recommendationsController.checkCanGenerate);

module.exports = router;
