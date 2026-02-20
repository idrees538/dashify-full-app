const Project = require('./project.model');
const asyncHandler = require('../../core/asyncHandler');
const ApiError = require('../../core/ApiError');
const { sendSuccess, sendPaginated } = require('../../core/response');
const validate = require('../../core/validate');

/**
 * @route   POST /api/projects
 * @desc    Create a new project
 */
const createProject = asyncHandler(async (req, res) => {
    validate(req.body, {
        name: { required: true, type: 'string', minLength: 1 },
        status: { enum: ['Active', 'Draft', 'Archived', 'Completed'] },
    });

    const project = await Project.create({
        ...req.body,
        owner: req.user._id,
    });

    sendSuccess(res, { project }, 'Project created', 201);
});

/**
 * @route   GET /api/projects
 * @desc    Get all projects for current user
 */
const getProjects = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status;

    const filter = { owner: req.user._id };
    if (status) filter.status = status;

    const [projects, total] = await Promise.all([
        Project.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit),
        Project.countDocuments(filter),
    ]);

    sendPaginated(res, projects, { page, limit, total }, 'Projects retrieved');
});

/**
 * @route   GET /api/projects/:id
 * @desc    Get project by ID
 */
const getProjectById = asyncHandler(async (req, res) => {
    const project = await Project.findOne({
        _id: req.params.id,
        owner: req.user._id,
    }).populate('members.user', 'name email avatar');

    if (!project) throw ApiError.notFound('Project not found');

    sendSuccess(res, { project }, 'Project retrieved');
});

/**
 * @route   PUT /api/projects/:id
 * @desc    Update project
 */
const updateProject = asyncHandler(async (req, res) => {
    const allowedFields = ['name', 'description', 'status', 'color', 'thumbnail', 'members'];
    const updates = {};

    for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
            updates[field] = req.body[field];
        }
    }

    const project = await Project.findOneAndUpdate(
        { _id: req.params.id, owner: req.user._id },
        updates,
        { new: true, runValidators: true }
    );

    if (!project) throw ApiError.notFound('Project not found');

    sendSuccess(res, { project }, 'Project updated');
});

/**
 * @route   DELETE /api/projects/:id
 * @desc    Delete project
 */
const deleteProject = asyncHandler(async (req, res) => {
    const project = await Project.findOneAndDelete({
        _id: req.params.id,
        owner: req.user._id,
    });

    if (!project) throw ApiError.notFound('Project not found');

    sendSuccess(res, null, 'Project deleted');
});

module.exports = { createProject, getProjects, getProjectById, updateProject, deleteProject };
