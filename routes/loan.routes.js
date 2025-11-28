const express = require('express');
const loanController = require('../controllers/loan.controller');
const { protect } = require('../middleware/auth.middleware');
const { validateLoan } = require('../middleware/validation.middleware');

const router = express.Router();

router.post('/', protect, validateLoan, loanController.requestLoan);
router.get('/history', protect, loanController.getLoanHistory);

module.exports = router;
