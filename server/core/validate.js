const ApiError = require('./ApiError');

/**
 * Lightweight request body validator.
 * @param {Object} body - req.body
 * @param {Object} rules - { fieldName: { required, type, minLength, maxLength, enum, match } }
 */
const validate = (body, rules) => {
    const errors = [];

    for (const [field, rule] of Object.entries(rules)) {
        const value = body[field];

        if (rule.required && (value === undefined || value === null || value === '')) {
            errors.push({ field, message: `${field} is required` });
            continue;
        }

        if (value === undefined || value === null) continue;

        if (rule.type && typeof value !== rule.type) {
            errors.push({ field, message: `${field} must be a ${rule.type}` });
        }

        if (rule.minLength && typeof value === 'string' && value.length < rule.minLength) {
            errors.push({ field, message: `${field} must be at least ${rule.minLength} characters` });
        }

        if (rule.maxLength && typeof value === 'string' && value.length > rule.maxLength) {
            errors.push({ field, message: `${field} must be at most ${rule.maxLength} characters` });
        }

        if (rule.enum && !rule.enum.includes(value)) {
            errors.push({ field, message: `${field} must be one of: ${rule.enum.join(', ')}` });
        }

        if (rule.match && typeof value === 'string' && !rule.match.test(value)) {
            errors.push({ field, message: `${field} format is invalid` });
        }
    }

    if (errors.length > 0) {
        throw ApiError.badRequest('Validation failed', errors);
    }
};

module.exports = validate;
