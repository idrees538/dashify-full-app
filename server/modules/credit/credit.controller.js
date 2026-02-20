const { CreditBank, Transaction } = require('./credit.model');
const asyncHandler = require('../../core/asyncHandler');
const ApiError = require('../../core/ApiError');
const { sendSuccess, sendPaginated } = require('../../core/response');
const validate = require('../../core/validate');

/**
 * @route   GET /api/credits/summary
 * @desc    Get credit bank summary for current user
 */
const getSummary = asyncHandler(async (req, res) => {
    let bank = await CreditBank.findOne({ user: req.user._id });

    // Auto-create bank for new users
    if (!bank) {
        bank = await CreditBank.create({ user: req.user._id });
    }

    sendSuccess(res, { bank }, 'Credit summary retrieved');
});

/**
 * @route   GET /api/credits/transactions
 * @desc    Get paginated transaction history
 */
const getTransactions = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const { type, category } = req.query;

    const filter = { user: req.user._id };
    if (type) filter.type = type;
    if (category) filter.category = category;

    const [transactions, total] = await Promise.all([
        Transaction.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
        Transaction.countDocuments(filter),
    ]);

    sendPaginated(res, transactions, { page, limit, total }, 'Transactions retrieved');
});

/**
 * @route   POST /api/credits/redeem
 * @desc    Redeem (use) credits
 */
const redeemCredits = asyncHandler(async (req, res) => {
    validate(req.body, {
        amount: { required: true, type: 'number' },
        description: { type: 'string' },
        category: { enum: ['Performance Video', 'Day in the Life', 'Visualizer', 'Report', 'Photography', 'Other'] },
    });

    const { amount, description, category } = req.body;

    const bank = await CreditBank.findOne({ user: req.user._id });
    if (!bank) throw ApiError.notFound('Credit bank not found');

    if (bank.remainingCredits < amount) {
        throw ApiError.badRequest(`Insufficient credits. Available: ${bank.remainingCredits}`);
    }

    bank.usedCredits += amount;
    await bank.save();

    const transaction = await Transaction.create({
        user: req.user._id,
        type: 'debit',
        amount,
        description: description || 'Credit redeemed',
        category: category || 'Other',
    });

    sendSuccess(res, { bank, transaction }, 'Credits redeemed');
});

/**
 * @route   POST /api/credits/add
 * @desc    Add credits (admin or purchase)
 */
const addCredits = asyncHandler(async (req, res) => {
    validate(req.body, {
        amount: { required: true, type: 'number' },
        description: { type: 'string' },
    });

    const { amount, description } = req.body;
    const userId = req.body.userId || req.user._id;

    let bank = await CreditBank.findOne({ user: userId });
    if (!bank) {
        bank = await CreditBank.create({ user: userId, totalCredits: 0 });
    }

    bank.totalCredits += amount;
    await bank.save();

    const transaction = await Transaction.create({
        user: userId,
        type: 'credit',
        amount,
        description: description || 'Credits purchased',
        category: 'Purchase',
    });

    sendSuccess(res, { bank, transaction }, 'Credits added', 201);
});

/**
 * @route   GET /api/credits/breakdown
 * @desc    Get credits breakdown by category
 */
const getCategoryBreakdown = asyncHandler(async (req, res) => {
    const breakdown = await Transaction.aggregate([
        { $match: { user: req.user._id, type: 'debit' } },
        {
            $group: {
                _id: '$category',
                total: { $sum: '$amount' },
                count: { $sum: 1 },
            },
        },
        { $sort: { total: -1 } },
    ]);

    const formatted = breakdown.map((b) => ({
        category: b._id,
        totalCredits: b.total,
        transactionCount: b.count,
    }));

    sendSuccess(res, { breakdown: formatted }, 'Category breakdown retrieved');
});

/**
 * @route   GET /api/credits/stats
 * @desc    Get credit statistics
 */
const getStats = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const [bank, totalAssigned, totalTransactions, categoryBreakdown, monthlyUsage] = await Promise.all([
        CreditBank.findOne({ user: userId }),
        Transaction.aggregate([
            { $match: { user: userId, type: 'credit' } },
            { $group: { _id: null, total: { $sum: '$amount' } } },
        ]),
        Transaction.countDocuments({ user: userId }),
        Transaction.aggregate([
            { $match: { user: userId, type: 'debit' } },
            { $group: { _id: '$category', total: { $sum: '$amount' } } },
            { $sort: { total: -1 } },
        ]),
        Transaction.aggregate([
            { $match: { user: userId, type: 'debit' } },
            {
                $group: {
                    _id: { $month: '$createdAt' },
                    total: { $sum: '$amount' },
                },
            },
            { $sort: { _id: 1 } },
        ]),
    ]);

    const mostFrequent = categoryBreakdown[0]?._id || 'None';
    const leastFrequent = categoryBreakdown[categoryBreakdown.length - 1]?._id || 'None';

    sendSuccess(res, {
        totalCreditsAssigned: totalAssigned[0]?.total || 0,
        totalTransactions,
        mostFrequentRequestType: mostFrequent,
        leastFrequentRequestType: leastFrequent,
        monthlyUsage,
        utilization: bank ? Math.round((bank.usedCredits / Math.max(bank.totalCredits, 1)) * 100) : 0,
    }, 'Credit stats retrieved');
});

module.exports = { getSummary, getTransactions, redeemCredits, addCredits, getCategoryBreakdown, getStats };
