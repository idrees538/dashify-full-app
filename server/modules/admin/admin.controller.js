const User = require('../user/user.model');
const Video = require('../video/video.model');
const Project = require('../project/project.model');
const { CreditBank, Transaction } = require('../credit/credit.model');
const asyncHandler = require('../../core/asyncHandler');
const { sendSuccess } = require('../../core/response');

/**
 * @route   GET /api/admin/stats
 * @desc    Get platform-wide statistics
 */
const getDashboardStats = asyncHandler(async (_req, res) => {
    const [totalUsers, totalProjects, totalVideos, totalCredits, recentUsers] = await Promise.all([
        User.countDocuments(),
        Project.countDocuments(),
        Video.countDocuments(),
        CreditBank.aggregate([
            {
                $group: {
                    _id: null,
                    totalAllocated: { $sum: '$totalCredits' },
                    totalUsed: { $sum: '$usedCredits' },
                },
            },
        ]),
        User.find().sort({ createdAt: -1 }).limit(5).select('name email role createdAt'),
    ]);

    sendSuccess(res, {
        totalUsers,
        totalProjects,
        totalVideos,
        credits: {
            totalAllocated: totalCredits[0]?.totalAllocated || 0,
            totalUsed: totalCredits[0]?.totalUsed || 0,
        },
        recentUsers,
    }, 'Admin stats retrieved');
});

/**
 * @route   PUT /api/admin/users/:id/role
 * @desc    Update user role
 */
const updateUserRole = asyncHandler(async (req, res) => {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
        throw require('../../core/ApiError').badRequest('Role must be "user" or "admin"');
    }

    const user = await User.findByIdAndUpdate(
        req.params.id,
        { role },
        { new: true }
    );

    if (!user) throw require('../../core/ApiError').notFound('User not found');

    sendSuccess(res, { user }, 'User role updated');
});

module.exports = { getDashboardStats, updateUserRole };
