const Activity = require('./activity.model');
const asyncHandler = require('../../core/asyncHandler');
const { sendSuccess, sendPaginated } = require('../../core/response');

/**
 * @route   GET /api/activity
 * @desc    Get activity log for current user
 */
const getActivities = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;
    const skip = (page - 1) * limit;
    const { resource, action } = req.query;

    const filter = { user: req.user._id };
    if (resource) filter.resource = resource;
    if (action) filter.action = action;

    const [activities, total] = await Promise.all([
        Activity.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
        Activity.countDocuments(filter),
    ]);

    sendPaginated(res, activities, { page, limit, total }, 'Activities retrieved');
});

/**
 * @route   POST /api/activity
 * @desc    Log an activity (can be called from other modules)
 */
const logActivity = asyncHandler(async (req, res) => {
    const activity = await Activity.create({
        user: req.user._id,
        ...req.body,
    });

    sendSuccess(res, { activity }, 'Activity logged', 201);
});

/**
 * Helper: Log activity from within other controllers (no req/res needed)
 */
const logActivityInternal = async (userId, action, resource, resourceId = null, metadata = {}) => {
    try {
        await Activity.create({ user: userId, action, resource, resourceId, metadata });
    } catch (err) {
        console.error('Failed to log activity:', err.message);
    }
};

module.exports = { getActivities, logActivity, logActivityInternal };
