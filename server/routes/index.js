const express = require('express');
const router = express.Router();

// Module routes
const authRoutes = require('../modules/auth/auth.routes');
const userRoutes = require('../modules/user/user.routes');
const projectRoutes = require('../modules/project/project.routes');
const videoRoutes = require('../modules/video/video.routes');
const creditRoutes = require('../modules/credit/credit.routes');
const calendarRoutes = require('../modules/calendar/calendar.routes');
const activityRoutes = require('../modules/activity/activity.routes');
const notificationRoutes = require('../modules/notification/notification.routes');
const dashboardRoutes = require('../modules/dashboard/dashboard.routes');
const analyticsRoutes = require('../modules/analytics/analytics.routes');
const settingsRoutes = require('../modules/settings/settings.routes');
const adminRoutes = require('../modules/admin/admin.routes');

// Register routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/projects', projectRoutes);
router.use('/videos', videoRoutes);
router.use('/credits', creditRoutes);
router.use('/calendar', calendarRoutes);
router.use('/activity', activityRoutes);
router.use('/notifications', notificationRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/settings', settingsRoutes);
router.use('/admin', adminRoutes);

// API index
router.get('/', (_req, res) => {
    res.json({
        message: 'Dashify API v1',
        endpoints: {
            auth: {
                'POST /api/auth/register': 'Register a new user',
                'POST /api/auth/login': 'Login',
                'GET  /api/auth/me': 'Get profile (protected)',
                'PUT  /api/auth/me': 'Update profile (protected)',
            },
            users: {
                'GET    /api/users': 'List users (admin)',
                'GET    /api/users/:id': 'Get user (admin)',
                'DELETE /api/users/:id': 'Delete user (admin)',
            },
            projects: {
                'POST   /api/projects': 'Create project',
                'GET    /api/projects': 'List projects',
                'GET    /api/projects/:id': 'Get project',
                'PUT    /api/projects/:id': 'Update project',
                'DELETE /api/projects/:id': 'Delete project',
            },
            videos: {
                'POST   /api/videos': 'Create video',
                'GET    /api/videos': 'List videos',
                'GET    /api/videos/:id': 'Get video',
                'PUT    /api/videos/:id': 'Update video',
                'DELETE /api/videos/:id': 'Delete video',
            },
            credits: {
                'GET  /api/credits/summary': 'Credit bank summary',
                'GET  /api/credits/transactions': 'Transaction history',
                'GET  /api/credits/breakdown': 'Category breakdown',
                'GET  /api/credits/stats': 'Credit statistics',
                'POST /api/credits/redeem': 'Redeem credits',
                'POST /api/credits/add': 'Add credits',
            },
            calendar: {
                'POST   /api/calendar': 'Create event',
                'GET    /api/calendar': 'List events (?start=&end=&type=)',
                'GET    /api/calendar/:id': 'Get event',
                'PUT    /api/calendar/:id': 'Update event',
                'DELETE /api/calendar/:id': 'Delete event',
            },
            activity: {
                'GET  /api/activity': 'Activity log',
                'POST /api/activity': 'Log activity',
            },
            notifications: {
                'GET    /api/notifications': 'List notifications',
                'PUT    /api/notifications/read-all': 'Mark all read',
                'PUT    /api/notifications/:id/read': 'Mark one read',
                'DELETE /api/notifications/:id': 'Delete notification',
            },
            dashboard: {
                'GET /api/dashboard': 'Aggregated dashboard data',
            },
            analytics: {
                'GET /api/analytics': 'Analytics data (?period=7|30|90)',
            },
            settings: {
                'GET /api/settings': 'Get settings',
                'PUT /api/settings/profile': 'Update profile',
                'PUT /api/settings/preferences': 'Update preferences',
                'PUT /api/settings/password': 'Change password',
            },
            admin: {
                'GET /api/admin/stats': 'Platform stats (admin)',
                'PUT /api/admin/users/:id/role': 'Update user role (admin)',
            },
        },
    });
});

module.exports = router;
