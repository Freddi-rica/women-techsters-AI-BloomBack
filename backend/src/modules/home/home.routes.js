const express = require('express');
const router = express.Router();
const homeController = require('./home.controller');
const { authRequired } = require('../../middleware/auth.middleware');

router.get('/dashboard', authRequired, homeController.getDashboard);

module.exports = router;
