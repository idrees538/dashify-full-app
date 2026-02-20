const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/auth');
const { adminOnly } = require('../../middleware/adminOnly');
const {
    getSummary,
    getTransactions,
    redeemCredits,
    addCredits,
    getCategoryBreakdown,
    getStats,
} = require('./credit.controller');

router.use(protect);

router.get('/summary', getSummary);
router.get('/transactions', getTransactions);
router.get('/breakdown', getCategoryBreakdown);
router.get('/stats', getStats);
router.post('/redeem', redeemCredits);
router.post('/add', addCredits);

module.exports = router;
