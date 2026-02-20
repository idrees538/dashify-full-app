const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/auth');
const { getDashboard } = require('./dashboard.controller');

router.get('/', protect, getDashboard);

module.exports = router;
