const express = require('express');
const authController = require('../controllers/auth.controller');
const { validateSignup, validateLogin } = require('../middleware/validation.middleware');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/signup', validateSignup, authController.signup);
router.post('/login', validateLogin, authController.login);
router.put('/change-password', protect, authController.changePassword);
router.post('/forgot-password', authController.forgotPassword);
router.put('/reset-password', authController.resetPassword);

module.exports = router;
