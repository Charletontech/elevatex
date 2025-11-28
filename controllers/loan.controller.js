const { Loan } = require('../models');
const User = require('../models/user.model'); // Import User model

const requestLoan = async (req, res) => {
  const { amount, reason } = req.body;

  // Validation already handled by middleware, but a final check for security
  if (!amount || !reason) {
    return res.status(400).json({ message: 'Amount and reason are required for a loan request.' });
  }

  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    await Loan.create({
      amount,
      reason,
      userId: req.user.id,
      status: 'pending', // Loans always pending admin approval
    });
    res.status(201).json({ message: 'Loan request submitted successfully.' });
  } catch (error) {
    console.error('Loan request error:', error);
    res.status(500).json({ message: 'An error occurred while submitting your loan request. Please try again.' });
  }
};

const getLoanHistory = async (req, res) => {
  try {
    const loans = await Loan.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(loans);
  } catch (error) {
    console.error("Get loan history error:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching loan history." });
  }
};

module.exports = {
  requestLoan,
  getLoanHistory,
};
