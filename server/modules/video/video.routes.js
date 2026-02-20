const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/auth');
const {
    createVideo,
    getVideos,
    getVideoById,
    updateVideo,
    deleteVideo,
} = require('./video.controller');

router.use(protect);

router.route('/').get(getVideos).post(createVideo);
router.route('/:id').get(getVideoById).put(updateVideo).delete(deleteVideo);

module.exports = router;
