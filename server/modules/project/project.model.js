const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Project name is required'],
            trim: true,
            maxlength: 200,
        },
        description: {
            type: String,
            default: '',
            maxlength: 2000,
        },
        status: {
            type: String,
            enum: ['Active', 'Draft', 'Archived', 'Completed'],
            default: 'Draft',
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        members: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                role: { type: String, enum: ['viewer', 'editor', 'admin'], default: 'viewer' },
            },
        ],
        color: {
            type: String,
            default: '#7C3AED',
        },
        thumbnail: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

// Index for fast owner lookups
projectSchema.index({ owner: 1, status: 1 });

module.exports = mongoose.model('Project', projectSchema);
