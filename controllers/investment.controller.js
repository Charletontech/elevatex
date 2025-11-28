const { User, Investment, Transaction } = require("../models");

const plans = {
  Starter: { min: 200, max: 999, duration: 7, roi: 10 },
  Standard: { min: 1000, max: 4999, duration: 14, roi: 20 },
  Premium: { min: 5000, max: 9999, duration: 21, roi: 30 },
  Elite: { min: 10000, max: 49999, duration: 30, roi: 45 },
  Retirement: { min: 50000, max: Infinity, duration: 45, roi: 60 },
};

exports.purchaseInvestment = async (req, res) => {
  const { plan, amount } = req.body;
  const userId = req.user.id;

  const selectedPlan = plans[plan];
  if (!selectedPlan) {
    return res.status(400).json({ message: "Invalid plan selected" });
  }

  const investmentAmount = parseFloat(amount);
  if (
    isNaN(investmentAmount) ||
    investmentAmount < selectedPlan.min ||
    investmentAmount > selectedPlan.max
  ) {
    return res
      .status(400)
      .json({
        message: `Investment amount must be between $${selectedPlan.min} and $${selectedPlan.max} for the ${plan} plan.`,
      });
  }

  try {
    const user = await User.findByPk(userId);
    if (user.balance < investmentAmount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    user.balance -= investmentAmount;
    await user.save();

    const startDate = new Date();
    const maturityDate = new Date();
    maturityDate.setDate(startDate.getDate() + selectedPlan.duration);

    const totalReturns =
      investmentAmount + investmentAmount * (selectedPlan.roi / 100);

    const investment = await Investment.create({
      planName: plan,
      amount: investmentAmount,
      duration: selectedPlan.duration,
      roi: selectedPlan.roi,
      returns: totalReturns,
      startDate,
      maturityDate,
      status: "active",
      userId: userId,
    });

    await Transaction.create({
      type: "Investment",
      amount: investmentAmount,
      status: "approved",
      userId: userId,
    });

    // Return a clean object and include `plan` for frontend convenience
    const investmentObj = investment.toJSON ? investment.toJSON() : investment;
    investmentObj.plan = plan;

    res
      .status(201)
      .json({
        message: "Investment purchased successfully",
        investment: investmentObj,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
