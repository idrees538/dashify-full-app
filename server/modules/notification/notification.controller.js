const Notification = require('./notification.model');
const asyncHandler = require('../../core/asyncHandler');
const ApiError = require('../../core/ApiError');
const { sendSuccess, sendPaginated } = require('../../core/response');

/**
 * @route   GET /api/notifications
 */
const getNotifications = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const { read, type } = req.query;

    const filter = { user: req.user._id };
    if (read !== undefined) filter.read = read === 'true';
    if (type) filter.type = type;

    const [notifications, total, unreadCount] = await Promise.all([
        Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
        Notification.countDocuments(filter),
        Notification.countDocuments({ user: req.user._id, read: false }),
    ]);

    sendPaginated(
        res,
        { notifications, unreadCount },
        { page, limit, total },
        'Notifications retrieved'
    );
});

/**
 * @route   PUT /api/notifications/:id/read
 */
const markAsRead = asyncHandler(async (req, res) => {
    const notification = await Notification.findOneAndUpdate(
        { _id: req.params.id, user: req.user._id },
        { read: true },
        { new: true }
    );

    if (!notification) throw ApiError.notFound('Notification not found');

    sendSuccess(res, { notification }, 'Notification marked as read');
});

/**
 * @route   PUT /api/notifications/read-all
 */
const markAllAsRead = asyncHandler(async (req, res) => {
    await Notification.updateMany(
        { user: req.user._id, read: false },
        { read: true }
    );

    sendSuccess(res, null, 'All notifications marked as read');
});

/**
 * @route   DELETE /api/notifications/:id
 */
const deleteNotification = asyncHandler(async (req, res) => {
    const notification = await Notification.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id,
    });

    if (!notification) throw ApiError.notFound('Notification not found');

    sendSuccess(res, null, 'Notification deleted');
});

/**
 * Helper: Create notification from within other controllers
 */
const createNotificationInternal = async (userId, title, message, type = 'info', link = '') => {
    try {
        await Notification.create({ user: userId, title, message, type, link });
    } catch (err) {
        console.error('Failed to create notification:', err.message);
    }
};

module.exports = { getNotifications, markAsRead, markAllAsRead, deleteNotification, createNotificationInternal };
