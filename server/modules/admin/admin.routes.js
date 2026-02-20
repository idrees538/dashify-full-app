const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/auth');
const { adminOnly } = require('../../middleware/adminOnly');
const { getDashboardStats, updateUserRole } = require('./admin.controller');

// All admin routes require authentication + admin role
router.use(protect, adminOnly);

router.get('/stats', getDashboardStats);
router.put('/users/:id/role', updateUserRole);

module.exports = router;
