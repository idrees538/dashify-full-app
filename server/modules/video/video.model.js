const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Video title is required'],
            trim: true,
            maxlength: 300,
        },
        description: {
            type: String,
            default: '',
            maxlength: 2000,
        },
        duration: {
            type: String,
            default: '0:00',
        },
        durationSeconds: {
            type: Number,
            default: 0,
        },
        tokensUsed: {
            type: Number,
            default: 0,
        },
        thumbnailUrl: {
            type: String,
            default: '',
        },
        videoUrl: {
            type: String,
            default: '',
        },
        status: {
            type: String,
            enum: ['Draft', 'Processing', 'Ready', 'Published', 'Archived'],
            default: 'Draft',
        },
        category: {
            type: String,
            enum: ['Performance Video', 'Day in the Life', 'Visualizer', 'Report', 'Photography', 'Other'],
            default: 'Other',
        },
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        views: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

videoSchema.index({ owner: 1, status: 1 });
videoSchema.index({ project: 1 });

module.exports = mongoose.model('Video', videoSchema);
