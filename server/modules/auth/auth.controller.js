const jwt = require('jsonwebtoken');
const User = require('../user/user.model');
const asyncHandler = require('../../core/asyncHandler');
const ApiError = require('../../core/ApiError');
const { sendSuccess } = require('../../core/response');
const validate = require('../../core/validate');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 */
const register = asyncHandler(async (req, res) => {
    validate(req.body, {
        name: { required: true, type: 'string', minLength: 2 },
        email: { required: true, type: 'string', match: /^\S+@\S+\.\S+$/ },
        password: { required: true, type: 'string', minLength: 6 },
    });

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw ApiError.conflict('Email already registered');
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    sendSuccess(res, { token, user }, 'Registration successful', 201);
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user and return JWT
 */
const login = asyncHandler(async (req, res) => {
    validate(req.body, {
        email: { required: true, type: 'string' },
        password: { required: true, type: 'string' },
    });

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        throw ApiError.unauthorized('Invalid email or password');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw ApiError.unauthorized('Invalid email or password');
    }

    const token = generateToken(user._id);

    sendSuccess(res, { token, user }, 'Login successful');
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 */
const getMe = asyncHandler(async (req, res) => {
    sendSuccess(res, { user: req.user }, 'Profile retrieved');
});

/**
 * @route   PUT /api/auth/me
 * @desc    Update current user profile
 */
const updateMe = asyncHandler(async (req, res) => {
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

module.exports = { register, login, getMe, updateMe };
