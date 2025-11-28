const express = require("express");
const transactionController = require("../controllers/transaction.controller");
const { protect, admin } = require("../middleware/auth.middleware");
const {
  validateDeposit,
  validateWithdrawal,
} = require("../middleware/validation.middleware");

const router = express.Router();

router.post(
  "/deposit",
  protect,
  transactionController.upload.single("screenshot"),
  transactionController.uploadToCloudinary,
  validateDeposit,
  transactionController.requestDeposit
);
router.post(
  "/withdraw",
  protect,
  validateWithdrawal,
  transactionController.requestWithdrawal
);
router.get("/mine", protect, transactionController.getUserTransactions);
router.get("/", protect, admin, transactionController.getAllTransactions);

module.exports = router;
