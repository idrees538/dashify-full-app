const Video = require('./video.model');
const asyncHandler = require('../../core/asyncHandler');
const ApiError = require('../../core/ApiError');
const { sendSuccess, sendPaginated } = require('../../core/response');
const validate = require('../../core/validate');

/**
 * @route   POST /api/videos
 */
const createVideo = asyncHandler(async (req, res) => {
    validate(req.body, {
        title: { required: true, type: 'string', minLength: 1 },
    });

    const video = await Video.create({
        ...req.body,
        owner: req.user._id,
    });

    sendSuccess(res, { video }, 'Video created', 201);
});

/**
 * @route   GET /api/videos
 */
const getVideos = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const { status, category, project } = req.query;

    const filter = { owner: req.user._id };
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (project) filter.project = project;

    const [videos, total] = await Promise.all([
        Video.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('project', 'name'),
        Video.countDocuments(filter),
    ]);

    sendPaginated(res, videos, { page, limit, total }, 'Videos retrieved');
});

/**
 * @route   GET /api/videos/:id
 */
const getVideoById = asyncHandler(async (req, res) => {
    const video = await Video.findOne({
        _id: req.params.id,
        owner: req.user._id,
    }).populate('project', 'name');

    if (!video) throw ApiError.notFound('Video not found');

    sendSuccess(res, { video }, 'Video retrieved');
});

/**
 * @route   PUT /api/videos/:id
 */
const updateVideo = asyncHandler(async (req, res) => {
    const allowedFields = ['title', 'description', 'duration', 'durationSeconds', 'tokensUsed', 'thumbnailUrl', 'videoUrl', 'status', 'category', 'project'];
    const updates = {};

    for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
            updates[field] = req.body[field];
        }
    }

    const video = await Video.findOneAndUpdate(
        { _id: req.params.id, owner: req.user._id },
        updates,
        { new: true, runValidators: true }
    );

    if (!video) throw ApiError.notFound('Video not found');

    sendSuccess(res, { video }, 'Video updated');
});

/**
 * @route   DELETE /api/videos/:id
 */
const deleteVideo = asyncHandler(async (req, res) => {
    const video = await Video.findOneAndDelete({
        _id: req.params.id,
        owner: req.user._id,
    });

    if (!video) throw ApiError.notFound('Video not found');

    sendSuccess(res, null, 'Video deleted');
});

module.exports = { createVideo, getVideos, getVideoById, updateVideo, deleteVideo };
