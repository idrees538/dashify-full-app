const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Event title is required'],
            trim: true,
            maxlength: 200,
        },
        description: {
            type: String,
            default: '',
            maxlength: 2000,
        },
        startDate: {
            type: Date,
            required: [true, 'Start date is required'],
        },
        endDate: {
            type: Date,
        },
        allDay: {
            type: Boolean,
            default: false,
        },
        color: {
            type: String,
            default: '#7C3AED',
        },
        type: {
            type: String,
            enum: ['meeting', 'shoot', 'post', 'deadline', 'reminder', 'other'],
            default: 'shoot',
        },
        time: {
            type: String,
            default: '',
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
        },
    },
    {
        timestamps: true,
    }
);

eventSchema.index({ user: 1, startDate: 1 });

module.exports = mongoose.model('Event', eventSchema);
