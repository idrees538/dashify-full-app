const ApiError = require('./ApiError');

/**
 * Global error handling middleware.
 * Handles ApiError, Mongoose errors, and unknown errors.
 */
const errorHandler = (err, req, res, _next) => {
    let error = { ...err, message: err.message };

    // Mongoose bad ObjectId / CastError
    if (err.name === 'CastError') {
        error = ApiError.badRequest(`Invalid ${err.path}: ${err.value}`);
    }

    // Mongoose duplicate key (11000)
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        error = ApiError.conflict(`Duplicate value for '${field}'`);
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map((e) => ({
            field: e.path,
            message: e.message,
        }));
        error = ApiError.badRequest('Validation failed', errors);
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        error = ApiError.unauthorized('Invalid token');
    }
    if (err.name === 'TokenExpiredError') {
        error = ApiError.unauthorized('Token expired');
    }

    const statusCode = error.statusCode || 500;
    const response = {
        success: false,
        message: error.message || 'Internal Server Error',
    };

    if (error.errors && error.errors.length > 0) {
        response.errors = error.errors;
    }

    if (process.env.NODE_ENV === 'development') {
        response.stack = err.stack;
    }

    console.error(`[ERROR] ${statusCode} - ${response.message}`);

    res.status(statusCode).json(response);
};

module.exports = errorHandler;
