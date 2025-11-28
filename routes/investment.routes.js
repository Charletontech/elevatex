const express = require('express');
const router = express.Router();
const investmentController = require('../controllers/investment.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/', protect, investmentController.purchaseInvestment);

module.exports = router;
