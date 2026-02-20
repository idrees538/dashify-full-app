const ApiError = require('../core/ApiError');

/**
 * Restrict route to admin users only.
 * Must be used after the auth `protect` middleware.
 */
const adminOnly = (req, _res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    throw ApiError.forbidden('Admin access required');
};

module.exports = { adminOnly };
