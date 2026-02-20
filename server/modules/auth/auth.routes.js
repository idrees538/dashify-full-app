const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/auth');
const { register, login, getMe, updateMe } = require('./auth.controller');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);

module.exports = router;
