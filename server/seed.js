/**
 * Seed script — Populates demo data for development.
 * Usage: npm run seed
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const User = require('./modules/user/user.model');
const Project = require('./modules/project/project.model');
const Video = require('./modules/video/video.model');
const { CreditBank, Transaction } = require('./modules/credit/credit.model');
const Event = require('./modules/calendar/event.model');
const Activity = require('./modules/activity/activity.model');
const Notification = require('./modules/notification/notification.model');

dotenv.config();

const seed = async () => {
    try {
        await connectDB();
        console.log('🗑️  Clearing existing data...');

        await Promise.all([
            User.deleteMany(),
            Project.deleteMany(),
            Video.deleteMany(),
            CreditBank.deleteMany(),
            Transaction.deleteMany(),
            Event.deleteMany(),
            Activity.deleteMany(),
            Notification.deleteMany(),
        ]);

        // ---------- Users ----------
        console.log('👤 Creating users...');
        const adminUser = await User.create({
            name: 'Admin User',
            email: 'admin@dashify.com',
            password: 'password123',
            role: 'admin',
            bio: 'Platform administrator',
            company: 'Dashify Inc.',
        });

        const demoUser = await User.create({
            name: 'John Doe',
            email: 'john@dashify.com',
            password: 'password123',
            role: 'user',
            bio: 'Pro Creator — producing content since 2020',
            company: 'Acme Studios',
            preferences: { theme: 'dark', notifications: { email: true, push: true } },
        });

        // ---------- Projects ----------
        console.log('📁 Creating projects...');
        const projects = await Project.insertMany([
            { name: 'Acme Studio', description: 'Main creative studio project', status: 'Active', owner: demoUser._id, color: '#7C3AED' },
            { name: 'Marketing Site', description: 'Company marketing website redesign', status: 'Draft', owner: demoUser._id, color: '#3B82F6' },
            { name: 'Product Launch 2026', description: 'Q1 product launch campaign', status: 'Active', owner: demoUser._id, color: '#10B981' },
        ]);

        // ---------- Videos ----------
        console.log('🎥 Creating videos...');
        const videos = await Video.insertMany([
            { title: 'Product Demo Walkthrough', duration: '3:45', durationSeconds: 225, tokensUsed: 10, status: 'Published', category: 'Performance Video', project: projects[0]._id, owner: demoUser._id, views: 1250 },
            { title: 'Marketing Campaign Intro', duration: '2:30', durationSeconds: 150, tokensUsed: 8, status: 'Published', category: 'Performance Video', project: projects[1]._id, owner: demoUser._id, views: 840 },
            { title: 'Customer Testimonial', duration: '5:12', durationSeconds: 312, tokensUsed: 15, status: 'Ready', category: 'Day in the Life', project: projects[0]._id, owner: demoUser._id, views: 520 },
            { title: 'Feature Announcement', duration: '1:55', durationSeconds: 115, tokensUsed: 6, status: 'Published', category: 'Visualizer', project: projects[2]._id, owner: demoUser._id, views: 340 },
            { title: 'Brand Story Video', duration: '4:20', durationSeconds: 260, tokensUsed: 12, status: 'Processing', category: 'Performance Video', owner: demoUser._id, views: 0 },
            { title: 'Tutorial Series Ep. 1', duration: '6:08', durationSeconds: 368, tokensUsed: 18, status: 'Draft', category: 'Report', owner: demoUser._id, views: 0 },
        ]);

        // ---------- Credits ----------
        console.log('💳 Creating credit bank & transactions...');
        await CreditBank.create({
            user: demoUser._id,
            totalCredits: 10,
            usedCredits: 7,
            rolloverCredits: 0,
            expiresAt: new Date('2025-09-26'),
        });

        const transactionData = [];
        for (let i = 0; i < 9; i++) {
            transactionData.push({
                user: demoUser._id,
                type: 'debit',
                amount: 5,
                description: 'Performance Video',
                category: 'Performance Video',
            });
        }
        transactionData.push(
            { user: demoUser._id, type: 'credit', amount: 10, description: 'Monthly credit allocation', category: 'Purchase' }
        );
        await Transaction.insertMany(transactionData);

        // ---------- Calendar Events ----------
        console.log('📅 Creating calendar events...');
        const today = new Date();
        await Event.insertMany([
            { title: 'Video Shoot — Acme', startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2), endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 17), type: 'shoot', color: '#7C3AED', user: demoUser._id, project: projects[0]._id },
            { title: 'Client Review Meeting', startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5, 10), endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5, 11), type: 'meeting', color: '#3B82F6', user: demoUser._id },
            { title: 'Marketing Deadline', startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7), allDay: true, type: 'deadline', color: '#EF4444', user: demoUser._id, project: projects[1]._id },
            { title: 'Team Standup', startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 9), endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 9, 30), type: 'meeting', color: '#10B981', user: demoUser._id },
        ]);

        // ---------- Activity ----------
        console.log('📊 Creating activity log...');
        await Activity.insertMany([
            { user: demoUser._id, action: 'created', resource: 'project', resourceId: projects[0]._id, description: 'Created project "Acme Studio"' },
            { user: demoUser._id, action: 'uploaded', resource: 'video', resourceId: videos[0]._id, description: 'Uploaded "Product Demo Walkthrough"' },
            { user: demoUser._id, action: 'redeemed', resource: 'credit', description: 'Redeemed 5 credits for Performance Video' },
            { user: demoUser._id, action: 'created', resource: 'event', description: 'Scheduled "Video Shoot — Acme"' },
            { user: demoUser._id, action: 'login', resource: 'user', description: 'Logged in' },
        ]);

        // ---------- Notifications ----------
        console.log('🔔 Creating notifications...');
        await Notification.insertMany([
            { user: demoUser._id, title: 'Welcome to Dashify!', message: 'Your account is set up and ready to go.', type: 'success', read: true, link: '/dashboard' },
            { user: demoUser._id, title: 'New credits available', message: 'Your monthly credit allocation of 10 credits has been added.', type: 'credit', read: false, link: '/credits' },
            { user: demoUser._id, title: 'Video processing complete', message: '"Product Demo Walkthrough" is now ready for review.', type: 'video', read: false, link: '/video' },
            { user: demoUser._id, title: 'Upcoming deadline', message: 'Marketing Deadline is in 7 days.', type: 'warning', read: false, link: '/calendar' },
        ]);

        console.log('\n✅ Seed completed successfully!');
        console.log('─────────────────────────────────');
        console.log('Demo accounts:');
        console.log('  Admin:  admin@dashify.com / password123');
        console.log('  User:   john@dashify.com  / password123');
        console.log('─────────────────────────────────\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seed failed:', error);
        process.exit(1);
    }
};

seed();
