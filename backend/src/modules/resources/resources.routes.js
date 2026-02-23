const express = require('express');
const router = express.Router();
const resourcesController = require('./resources.controller');
const { authRequired, optionalAuth } = require('../../middleware/auth.middleware');

router.get('/', optionalAuth, resourcesController.listResources);
router.get('/search', optionalAuth, resourcesController.searchResources);
router.get('/saved', authRequired, resourcesController.getSavedResources);
router.get('/:id', optionalAuth, resourcesController.getResource);
router.post('/:id/complete', authRequired, resourcesController.completeResource);
router.post('/:id/save', authRequired, resourcesController.saveResource);

module.exports = router;
