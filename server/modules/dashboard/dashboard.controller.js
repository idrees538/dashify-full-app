const { CreditBank } = require('../credit/credit.model');
const Video = require('../video/video.model');
const Project = require('../project/project.model');
const Activity = require('../activity/activity.model');
const Notification = require('../notification/notification.model');
const asyncHandler = require('../../core/asyncHandler');
const { sendSuccess } = require('../../core/response');

/**
 * @route   GET /api/dashboard
 * @desc    Get aggregated dashboard data for the current user
 */
const getDashboard = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const [creditBank, videoStats, projectStats, recentActivity, unreadNotifications] = await Promise.all([
        // Credit bank summary
        CreditBank.findOne({ user: userId }),

        // Video stats
        Video.aggregate([
            { $match: { owner: userId } },
            {
                $group: {
                    _id: null,
                    totalVideos: { $sum: 1 },
                    totalViews: { $sum: '$views' },
                    totalTokensUsed: { $sum: '$tokensUsed' },
                },
            },
        ]),

        // Project stats
        Project.aggregate([
            { $match: { owner: userId } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                },
            },
        ]),

        // Recent activity (last 5)
        Activity.find({ user: userId }).sort({ createdAt: -1 }).limit(5),

        // Unread notification count
        Notification.countDocuments({ user: userId, read: false }),
    ]);

    // Build token usage summary
    const tokenUsage = {
        total: creditBank?.totalCredits || 0,
        used: creditBank?.usedCredits || 0,
        remaining: creditBank?.remainingCredits || 0,
        rollover: creditBank?.rolloverCredits || 0,
        expiresAt: creditBank?.expiresAt || null,
    };

    // Build quick access widgets
    const widgets = {
        videoUsage: videoStats[0]?.totalVideos || 0,
        totalViews: videoStats[0]?.totalViews || 0,
        totalTokensUsed: videoStats[0]?.totalTokensUsed || 0,
    };

    // Build project summary
    const projects = {};
    projectStats.forEach((p) => {
        projects[p._id.toLowerCase()] = p.count;
    });

    sendSuccess(res, {
        tokenUsage,
        widgets,
        projects,
        recentActivity,
        unreadNotifications,
    }, 'Dashboard data retrieved');
});

module.exports = { getDashboard };
