const jwt = require('jsonwebtoken');
const ApiError = require('../core/ApiError');
const asyncHandler = require('../core/asyncHandler');
const User = require('../modules/user/user.model');

/**
 * Protect routes — verify JWT and attach req.user.
 */
const protect = asyncHandler(async (req, _res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        throw ApiError.unauthorized('Not authorized — no token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
        throw ApiError.unauthorized('User no longer exists');
    }

    req.user = user;
    next();
});

module.exports = { protect };
