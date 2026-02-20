const Video = require('../video/video.model');
const { Transaction } = require('../credit/credit.model');
const Activity = require('../activity/activity.model');
const asyncHandler = require('../../core/asyncHandler');
const { sendSuccess } = require('../../core/response');

/**
 * @route   GET /api/analytics
 * @desc    Get analytics data with optional period filter
 */
const getAnalytics = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const period = req.query.period || '30'; // days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    const [
        viewStats,
        tokenConsumption,
        weeklyActivity,
        monthlyGrowth,
        categoryBreakdown,
    ] = await Promise.all([
        // Total views & engagement
        Video.aggregate([
            { $match: { owner: userId } },
            {
                $group: {
                    _id: null,
                    totalViews: { $sum: '$views' },
                    totalVideos: { $sum: 1 },
                    avgViews: { $avg: '$views' },
                },
            },
        ]),

        // Token consumption in period
        Transaction.aggregate([
            {
                $match: {
                    user: userId,
                    type: 'debit',
                    createdAt: { $gte: startDate },
                },
            },
            { $group: { _id: null, total: { $sum: '$amount' } } },
        ]),

        // Weekly activity (last 7 days)
        Activity.aggregate([
            {
                $match: {
                    user: userId,
                    createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
                },
            },
            {
                $group: {
                    _id: { $dayOfWeek: '$createdAt' },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]),

        // Monthly growth (last 12 months)
        Video.aggregate([
            { $match: { owner: userId } },
            {
                $group: {
                    _id: { $month: '$createdAt' },
                    count: { $sum: 1 },
                    views: { $sum: '$views' },
                },
            },
            { $sort: { _id: 1 } },
        ]),

        // Video category breakdown
        Video.aggregate([
            { $match: { owner: userId } },
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                    totalViews: { $sum: '$views' },
                },
            },
            { $sort: { count: -1 } },
        ]),
    ]);

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeklyData = dayNames.map((label, i) => {
        const day = weeklyActivity.find((d) => d._id === i + 1);
        return { label, value: day?.count || 0 };
    });

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData = monthNames.map((label, i) => {
        const month = monthlyGrowth.find((m) => m._id === i + 1);
        return { label, videos: month?.count || 0, views: month?.views || 0 };
    });

    sendSuccess(res, {
        cards: {
            totalViews: viewStats[0]?.totalViews || 0,
            totalVideos: viewStats[0]?.totalVideos || 0,
            avgViews: Math.round(viewStats[0]?.avgViews || 0),
            tokenConsumption: tokenConsumption[0]?.total || 0,
        },
        weeklyActivity: weeklyData,
        monthlyGrowth: monthlyData,
        categoryBreakdown: categoryBreakdown.map((c) => ({
            category: c._id,
            count: c.count,
            views: c.totalViews,
        })),
    }, 'Analytics retrieved');
});

module.exports = { getAnalytics };
