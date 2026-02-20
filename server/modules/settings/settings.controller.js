const User = require('../user/user.model');
const asyncHandler = require('../../core/asyncHandler');
const ApiError = require('../../core/ApiError');
const { sendSuccess } = require('../../core/response');
const validate = require('../../core/validate');

/**
 * @route   GET /api/settings
 * @desc    Get user settings (profile + preferences)
 */
const getSettings = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    sendSuccess(res, { user }, 'Settings retrieved');
});

/**
 * @route   PUT /api/settings/profile
 * @desc    Update profile information
 */
const updateProfile = asyncHandler(async (req, res) => {
    const allowedFields = ['name', 'avatar', 'bio', 'phone', 'company'];
    const updates = {};

    for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
            updates[field] = req.body[field];
        }
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
        new: true,
        runValidators: true,
    });

    sendSuccess(res, { user }, 'Profile updated');
});

/**
 * @route   PUT /api/settings/preferences
 * @desc    Update user preferences (theme, notifications)
 */
const updatePreferences = asyncHandler(async (req, res) => {
    const { theme, notifications } = req.body;
    const updates = {};

    if (theme) {
        validate({ theme }, { theme: { enum: ['light', 'dark'] } });
        updates['preferences.theme'] = theme;
    }

    if (notifications) {
        if (notifications.email !== undefined) updates['preferences.notifications.email'] = notifications.email;
        if (notifications.push !== undefined) updates['preferences.notifications.push'] = notifications.push;
    }

    const user = await User.findByIdAndUpdate(req.user._id, { $set: updates }, {
        new: true,
        runValidators: true,
    });

    sendSuccess(res, { user }, 'Preferences updated');
});

/**
 * @route   PUT /api/settings/password
 * @desc    Change password
 */
const changePassword = asyncHandler(async (req, res) => {
    validate(req.body, {
        currentPassword: { required: true, type: 'string' },
        newPassword: { required: true, type: 'string', minLength: 6 },
    });

    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
        throw ApiError.unauthorized('Current password is incorrect');
    }

    user.password = newPassword;
    await user.save();

    sendSuccess(res, null, 'Password updated');
});

module.exports = { getSettings, updateProfile, updatePreferences, changePassword };
