const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/auth');
const { getSettings, updateProfile, updatePreferences, changePassword } = require('./settings.controller');

router.use(protect);

router.get('/', getSettings);
router.put('/profile', updateProfile);
router.put('/preferences', updatePreferences);
router.put('/password', changePassword);

module.exports = router;
