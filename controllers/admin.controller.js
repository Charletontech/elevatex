const { User, Transaction, Loan, Notification } = require("../models");
const {
  sendDepositApprovedEmail,
  sendDepositDeclinedEmail,
  sendWithdrawalApprovedEmail,
  sendWithdrawalDeclinedEmail,
  sendLoanApprovedEmail,
  sendLoanDeclinedEmail,
  sendCustomEmail,
} = require("../services/email.service");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ["password"] } });
    res.status(200).json(users);
  } catch (error) {
    console.error("Get all users error:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching users." });
  }
};

const getUserById = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Get user by ID error:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching the user." });
  }
};

const approveDeposit = async (req, res) => {
  const { transactionId } = req.params;
  try {
    const transaction = await Transaction.findByPk(transactionId);
    if (!transaction || transaction.type !== "deposit") {
      return res
        .status(404)
        .json({ message: "Deposit transaction not found." });
    }
    if (transaction.status !== "pending") {
      return res
        .status(400)
        .json({ message: `Deposit is already ${transaction.status}.` });
    }

    const user = await User.findByPk(transaction.userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found for this transaction." });
    }

    user.balance += transaction.amount;
    transaction.status = "approved";

    await user.save();
    await transaction.save();

    // Create a notification for the user
    await Notification.create({
      userId: user.id,
      message: `Your deposit of $${transaction.amount} has been approved.`,
    });

    // Send email to user
    await sendDepositApprovedEmail(user, transaction);

    res.status(200).json({ message: "Deposit approved successfully." });
  } catch (error) {
    console.error("Approve deposit error:", error);
    res
      .status(500)
      .json({ message: "An error occurred while approving the deposit." });
  }
};

const declineDeposit = async (req, res) => {
  const { transactionId } = req.params;
  try {
    const transaction = await Transaction.findByPk(transactionId);
    if (!transaction || transaction.type !== "deposit") {
      return res
        .status(404)
        .json({ message: "Deposit transaction not found." });
    }
    if (transaction.status !== "pending") {
      return res
        .status(400)
        .json({ message: `Deposit is already ${transaction.status}.` });
    }

    // If there's an uploaded file on Cloudinary, remove it
    try {
      if (transaction.screenshotPublicId) {
        const { removeRemoteFile } = require("../services/cloudinary.service");
        await removeRemoteFile(transaction.screenshotPublicId);
      }
    } catch (err) {
      console.error("Failed to remove remote file for declined deposit:", err);
      // proceed anyway
    }

    transaction.status = "declined";
    await transaction.save();

    const user = await User.findByPk(transaction.userId);

    // Create a notification for the user
    await Notification.create({
      userId: user.id,
      message: `Your deposit of $${transaction.amount} has been declined.`,
    });

    // Send email to user
    await sendDepositDeclinedEmail(user, transaction);

    res.status(200).json({ message: "Deposit declined successfully." });
  } catch (error) {
    console.error("Decline deposit error:", error);
    res
      .status(500)
      .json({ message: "An error occurred while declining the deposit." });
  }
};

const approveWithdrawal = async (req, res) => {
  const { transactionId } = req.params;
  try {
    const transaction = await Transaction.findByPk(transactionId);
    if (!transaction || transaction.type !== "withdrawal") {
      return res
        .status(404)
        .json({ message: "Withdrawal transaction not found." });
    }
    if (transaction.status !== "pending") {
      return res
        .status(400)
        .json({ message: `Withdrawal is already ${transaction.status}.` });
    }

    const user = await User.findByPk(transaction.userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found for this transaction." });
    }

    if (user.balance < transaction.amount) {
      // This scenario should ideally be prevented on submission but good to check again
      transaction.status = "declined"; // Decline if insufficient balance
      await transaction.save();
      return res
        .status(400)
        .json({
          message:
            "Insufficient user balance for this withdrawal. Request declined.",
        });
    }

    user.balance -= transaction.amount;
    transaction.status = "approved";

    await user.save();
    await transaction.save();

    // Create a notification for the user
    await Notification.create({
      userId: user.id,
      message: `Your withdrawal of $${transaction.amount} has been approved.`,
    });

    // Send email to user
    await sendWithdrawalApprovedEmail(user, transaction);

    res.status(200).json({ message: "Withdrawal approved successfully." });
  } catch (error) {
    console.error("Approve withdrawal error:", error);
    res
      .status(500)
      .json({ message: "An error occurred while approving the withdrawal." });
  }
};

const declineWithdrawal = async (req, res) => {
  const { transactionId } = req.params;
  try {
    const transaction = await Transaction.findByPk(transactionId);
    if (!transaction || transaction.type !== "withdrawal") {
      return res
        .status(404)
        .json({ message: "Withdrawal transaction not found." });
    }
    if (transaction.status !== "pending") {
      return res
        .status(400)
        .json({ message: `Withdrawal is already ${transaction.status}.` });
    }

    transaction.status = "declined";
    await transaction.save();

    const user = await User.findByPk(transaction.userId);

    // Create a notification for the user
    await Notification.create({
      userId: user.id,
      message: `Your withdrawal of $${transaction.amount} has been declined.`,
    });

    // Send email to user
    await sendWithdrawalDeclinedEmail(user, transaction);

    res.status(200).json({ message: "Withdrawal declined successfully." });
  } catch (error) {
    console.error("Decline withdrawal error:", error);
    res
      .status(500)
      .json({ message: "An error occurred while declining the withdrawal." });
  }
};

const approveLoan = async (req, res) => {
  const { loanId } = req.params;
  try {
    const loan = await Loan.findByPk(loanId);
    if (!loan) {
      return res.status(404).json({ message: "Loan not found." });
    }
    if (loan.status !== "pending") {
      return res
        .status(400)
        .json({ message: `Loan is already ${loan.status}.` });
    }

    const user = await User.findByPk(loan.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found for this loan." });
    }

    user.balance += loan.amount; // Add loan amount to user's balance
    loan.status = "approved";

    await user.save();
    await loan.save();

    // Create a notification for the user
    await Notification.create({
      userId: user.id,
      message: `Your loan request for $${loan.amount} has been approved.`,
    });

    // Send email to user
    await sendLoanApprovedEmail(user, loan);

    res.status(200).json({ message: "Loan approved successfully." });
  } catch (error) {
    console.error("Approve loan error:", error);
    res
      .status(500)
      .json({ message: "An error occurred while approving the loan." });
  }
};

const declineLoan = async (req, res) => {
  const { loanId } = req.params;
  try {
    const loan = await Loan.findByPk(loanId);
    if (!loan) {
      return res.status(404).json({ message: "Loan not found." });
    }
    if (loan.status !== "pending") {
      return res
        .status(400)
        .json({ message: `Loan is already ${loan.status}.` });
    }

    loan.status = "declined";
    await loan.save();

    const user = await User.findByPk(loan.userId);

    // Create a notification for the user
    await Notification.create({
      userId: loan.userId,
      message: `Your loan request for $${loan.amount} has been declined.`,
    });

    // Send email to user
    await sendLoanDeclinedEmail(user, loan);

    res.status(200).json({ message: "Loan declined successfully." });
  } catch (error) {
    console.error("Decline loan error:", error);
    res
      .status(500)
      .json({ message: "An error occurred while declining the loan." });
  }
};

const editUserBalance = async (req, res) => {
  const { userId } = req.params;
  const { amount } = req.body;

  if (typeof amount !== "number") {
    return res.status(400).json({ message: "Amount must be a number." });
  }

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.balance = amount; // Set new balance
    await user.save();

    res
      .status(200)
      .json({ message: `User ${user.username} balance updated to ${amount}.` });
  } catch (error) {
    console.error("Edit user balance error:", error);
    res
      .status(500)
      .json({ message: "An error occurred while updating user balance." });
  }
};

const sendEmailToUser = async (req, res) => {
  const { recipientEmail, subject, message } = req.body;

  if (!recipientEmail || !subject || !message) {
    return res
      .status(400)
      .json({ message: "Recipient, subject, and message are required." });
  }

  try {
    const user = await User.findOne({ where: { email: recipientEmail } });
    const recipient = {
      name: user ? user.fullname : recipientEmail,
      email: recipientEmail,
    };

    await sendCustomEmail(recipient, subject, message);
    res.status(200).json({ message: "Email sent successfully." });
  } catch (error) {
    console.error("Send custom email error:", error);
    res
      .status(500)
      .json({ message: "An error occurred while sending the email." });
  }
};

const getAllLoans = async (req, res) => {
  try {
    const loans = await Loan.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "fullname", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(loans);
  } catch (error) {
    console.error("Get all loans error:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching loans." });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  approveDeposit,
  declineDeposit,
  approveWithdrawal,
  declineWithdrawal,
  approveLoan,
  declineLoan,
  editUserBalance,
  sendEmailToUser,
  getAllLoans,
};
