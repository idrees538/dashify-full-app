const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/auth');
const { adminOnly } = require('../../middleware/adminOnly');
const { getAllUsers, getUserById, deleteUser } = require('./user.controller');

// All user routes require admin access
router.use(protect, adminOnly);

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.delete('/:id', deleteUser);

module.exports = router;
