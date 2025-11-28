const express = require('express');
const dashboardController = require('../controllers/dashboard.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', protect, dashboardController.getDashboardData);
router.get('/profile', protect, dashboardController.getProfile);
router.put('/profile', protect, dashboardController.updateProfile);

module.exports = router;
