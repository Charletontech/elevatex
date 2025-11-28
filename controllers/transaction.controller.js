const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { Transaction, User } = require("../models"); // Import User model to update balance
const {
  uploadFile,
  removeLocalFile,
} = require("../services/cloudinary.service");

// Use multer to store temporarily in a tmp folder; we'll upload to Cloudinary and delete the local file
const tmpDir = path.join(__dirname, "..", "tmp");
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}

const upload = multer({ dest: path.join(tmpDir, "") });

// Middleware to upload the received file (from multer) to Cloudinary and clean up local file
async function uploadToCloudinary(req, res, next) {
  if (!req.file) return next();

  const localPath = req.file.path;
  try {
    const result = await uploadFile(localPath, { folder: "elevatex/deposits" });
    // attach cloudinary url to request for downstream handlers
    req.fileUrl = result.secure_url || result.url;
    req.filePublicId = result.public_id;
  } catch (err) {
    console.error("Cloudinary upload failed:", err);
    // attempt to remove local file even on failure
    await removeLocalFile(localPath);
    return res
      .status(500)
      .json({ message: "File upload failed. Please try again." });
  }

  // cleanup local file
  await removeLocalFile(localPath);
  next();
}

const requestDeposit = async (req, res) => {
  const { amount } = req.body;
  // screenshot URL provided by uploadToCloudinary middleware
  const screenshotUrl = req.fileUrl || null;

  if (!amount || !screenshotUrl) {
    // This validation is also in middleware, but good to have a fallback
    return res
      .status(400)
      .json({ message: "Amount and screenshot are required for deposit." });
  }

  try {
    const newTransaction = await Transaction.create({
      type: "deposit",
      amount,
      screenshot: screenshotUrl, // Save cloudinary url
      screenshotPublicId: req.filePublicId || null,
      userId: req.user.id,
      status: "pending", // Deposits always pending admin approval
    });
    res
      .status(201)
      .json({
        message: "Deposit request submitted successfully.",
        transaction: newTransaction,
      });
  } catch (error) {
    console.error("Deposit request error:", error);
    res
      .status(500)
      .json({
        message:
          "An error occurred while submitting your deposit request. Please try again.",
      });
  }
};

const requestWithdrawal = async (req, res) => {
  const { amount } = req.body;

  if (!amount) {
    // Validation handled by middleware, fallback
    return res
      .status(400)
      .json({ message: "Amount is required for withdrawal." });
  }

  try {
    const user = await User.findByPk(req.user.id); // Fetch updated user balance
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.balance < amount) {
      return res
        .status(400)
        .json({ message: "Insufficient balance for withdrawal." });
    }

    // Create pending withdrawal request
    const newTransaction = await Transaction.create({
      type: "withdrawal",
      amount,
      userId: user.id,
      status: "pending", // Withdrawals always pending admin approval
    });

    res
      .status(201)
      .json({
        message: "Withdrawal request submitted successfully.",
        transaction: newTransaction,
      });
  } catch (error) {
    console.error("Withdrawal request error:", error);
    res
      .status(500)
      .json({
        message:
          "An error occurred while submitting your withdrawal request. Please try again.",
      });
  }
};

const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll();
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Get all transactions error:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching transactions." });
  }
};

// Fetch transactions belonging to the current user with pagination support
const getUserTransactions = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const offset = (page - 1) * limit;

    const where = { userId: req.user.id };
    if (req.query.type) where.type = req.query.type; // optional filter

    const { count, rows } = await Transaction.findAndCountAll({
      where,
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    const totalPages = Math.max(1, Math.ceil(count / limit));

    res
      .status(200)
      .json({ transactions: rows, meta: { count, page, limit, totalPages } });
  } catch (error) {
    console.error("Get user transactions error:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching your transactions." });
  }
};

module.exports = {
  requestDeposit,
  requestWithdrawal,
  getAllTransactions,
  getUserTransactions,
  upload,
  uploadToCloudinary,
};
