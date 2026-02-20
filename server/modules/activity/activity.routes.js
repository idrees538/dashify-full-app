const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/auth');
const { getActivities, logActivity } = require('./activity.controller');

router.use(protect);

router.route('/').get(getActivities).post(logActivity);

module.exports = router;
