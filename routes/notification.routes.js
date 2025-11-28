const express = require('express');
const notificationController = require('../controllers/notification.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', protect, notificationController.getNotifications);
router.put('/read-all', protect, notificationController.markAllAsRead);
router.put('/:notificationId/read', protect, notificationController.markAsRead);

module.exports = router;
