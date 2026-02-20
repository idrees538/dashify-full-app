const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        action: {
            type: String,
            required: true,
            enum: ['created', 'updated', 'deleted', 'viewed', 'redeemed', 'uploaded', 'shared', 'commented', 'login'],
        },
        resource: {
            type: String,
            required: true,
            enum: ['project', 'video', 'credit', 'event', 'settings', 'user', 'deliverable', 'review'],
        },
        resourceId: {
            type: mongoose.Schema.Types.ObjectId,
        },
        metadata: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
        description: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

activitySchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Activity', activitySchema);
