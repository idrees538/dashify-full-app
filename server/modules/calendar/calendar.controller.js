const Event = require('./event.model');
const asyncHandler = require('../../core/asyncHandler');
const ApiError = require('../../core/ApiError');
const { sendSuccess } = require('../../core/response');
const validate = require('../../core/validate');

/** Helper: get user ID if authenticated, otherwise null */
const getUserId = (req) => req.user?._id || null;

/**
 * @route   POST /api/calendar
 */
const createEvent = asyncHandler(async (req, res) => {
    validate(req.body, {
        title: { required: true, type: 'string' },
        startDate: { required: true, type: 'string' },
    });

    const eventData = { ...req.body };
    const userId = getUserId(req);
    if (userId) eventData.user = userId;

    const event = await Event.create(eventData);

    sendSuccess(res, { event }, 'Event created', 201);
});

/**
 * @route   GET /api/calendar
 * @desc    Get events, optionally filtered by date range
 */
const getEvents = asyncHandler(async (req, res) => {
    const { start, end, type } = req.query;
    const filter = {};

    const userId = getUserId(req);
    if (userId) filter.user = userId;

    if (start || end) {
        filter.startDate = {};
        if (start) filter.startDate.$gte = new Date(start);
        if (end) filter.startDate.$lte = new Date(end);
    }
    if (type) filter.type = type;

    const events = await Event.find(filter).sort({ startDate: 1 }).populate('project', 'name');

    sendSuccess(res, { events }, 'Events retrieved');
});

/**
 * @route   GET /api/calendar/:id
 */
const getEventById = asyncHandler(async (req, res) => {
    const query = { _id: req.params.id };
    const userId = getUserId(req);
    if (userId) query.user = userId;

    const event = await Event.findOne(query);

    if (!event) throw ApiError.notFound('Event not found');

    sendSuccess(res, { event }, 'Event retrieved');
});

/**
 * @route   PUT /api/calendar/:id
 */
const updateEvent = asyncHandler(async (req, res) => {
    const allowedFields = ['title', 'description', 'startDate', 'endDate', 'allDay', 'color', 'type', 'time', 'project'];
    const updates = {};

    for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
            updates[field] = req.body[field];
        }
    }

    const query = { _id: req.params.id };
    const userId = getUserId(req);
    if (userId) query.user = userId;

    const event = await Event.findOneAndUpdate(query, updates, { new: true, runValidators: true });

    if (!event) throw ApiError.notFound('Event not found');

    sendSuccess(res, { event }, 'Event updated');
});

/**
 * @route   DELETE /api/calendar/:id
 */
const deleteEvent = asyncHandler(async (req, res) => {
    const query = { _id: req.params.id };
    const userId = getUserId(req);
    if (userId) query.user = userId;

    const event = await Event.findOneAndDelete(query);

    if (!event) throw ApiError.notFound('Event not found');

    sendSuccess(res, null, 'Event deleted');
});

module.exports = { createEvent, getEvents, getEventById, updateEvent, deleteEvent };
