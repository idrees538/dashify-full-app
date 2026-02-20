const User = require('./user.model');
const asyncHandler = require('../../core/asyncHandler');
const ApiError = require('../../core/ApiError');
const { sendSuccess, sendPaginated } = require('../../core/response');

/**
 * @route   GET /api/users
 * @desc    Get all users (admin only)
 */
const getAllUsers = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
        User.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
        User.countDocuments(),
    ]);

    sendPaginated(res, users, { page, limit, total }, 'Users retrieved');
});

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID (admin only)
 */
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) throw ApiError.notFound('User not found');

    sendSuccess(res, { user }, 'User retrieved');
});

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user (admin only)
 */
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) throw ApiError.notFound('User not found');

    await user.deleteOne();
    sendSuccess(res, null, 'User deleted');
});

module.exports = { getAllUsers, getUserById, deleteUser };
