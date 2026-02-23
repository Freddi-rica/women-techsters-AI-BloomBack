const express = require('express');
const router = express.Router();
const storiesController = require('./stories.controller');
const { authRequired, optionalAuth } = require('../../middleware/auth.middleware');

router.get('/', optionalAuth, storiesController.listStories);
router.post('/', authRequired, storiesController.createStory);
router.get('/:id', optionalAuth, storiesController.getStory);
router.post('/:id/like', authRequired, storiesController.toggleLike);

module.exports = router;
