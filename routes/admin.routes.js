const express = require('express');
const adminController = require('../controllers/admin.controller');
const { protect, admin } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/users', protect, admin, adminController.getAllUsers);
router.get('/users/:userId', protect, admin, adminController.getUserById);
router.put('/deposits/approve/:transactionId', protect, admin, adminController.approveDeposit);
router.put('/deposits/decline/:transactionId', protect, admin, adminController.declineDeposit);
router.put('/withdrawals/approve/:transactionId', protect, admin, adminController.approveWithdrawal);
router.put('/withdrawals/decline/:transactionId', protect, admin, adminController.declineWithdrawal);
router.put('/loans/approve/:loanId', protect, admin, adminController.approveLoan);
router.put('/loans/decline/:loanId', protect, admin, adminController.declineLoan);
router.put('/users/:userId/balance', protect, admin, adminController.editUserBalance);
router.post('/send-email', protect, admin, adminController.sendEmailToUser);
router.get('/loans', protect, admin, adminController.getAllLoans);

module.exports = router;
