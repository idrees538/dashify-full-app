/**
 * Standardised success response helper.
 */
const sendSuccess = (res, data = null, message = 'Success', statusCode = 200) => {
    const response = { success: true, message };

    if (data !== null) {
        response.data = data;
    }

    return res.status(statusCode).json(response);
};

/**
 * Paginated success response helper.
 */
const sendPaginated = (res, data, pagination, message = 'Success') => {
    return res.status(200).json({
        success: true,
        message,
        data,
        pagination,
    });
};

module.exports = { sendSuccess, sendPaginated };
