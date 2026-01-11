const { Op, Transaction } = require("sequelize");
const sequelize = require("../config/database");
const { Investment, User, Notification } = require("../models");

const processMaturedInvestments = async () => {
  const maturedInvestments = await Investment.findAll({
    where: {
      status: "active",
      maturityDate: { [Op.lte]: new Date() },
    },
    attributes: ["id"],
  });

  if (!maturedInvestments.length) {
    return;
  }

  for (const { id } of maturedInvestments) {
    const transaction = await sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });

    try {
      const investment = await Investment.findOne({
        where: { id, status: "active" },
        include: [{ model: User, as: "user" }],
        lock: transaction.LOCK.UPDATE,
        transaction,
      });

      if (!investment) {
        await transaction.rollback();
        continue;
      }

      const returns = Number(investment.returns);
      const profit = returns - Number(investment.amount);
      if (Number.isNaN(returns)) {
        throw new Error(`Invalid returns for investment ${investment.id}`);
      }

      // Credit user balance and profits
      investment.user.balance = Number(investment.user.balance) + returns;
      investment.user.profits = Number(investment.user.profits || 0) + profit;

      await investment.user.save({ transaction });

      // Mark investment completed
      investment.status = "completed";
      await investment.save({ transaction });

      // Create notification
      await Notification.create(
        {
          userId: investment.user.id,
          message: `Your investment of $${investment.amount} has matured. Your account has been credited with $${returns}.`,
        },
        { transaction }
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      console.error(`Failed processing investment ${id}:`, error.message);
      continue;
    }
  }
};

module.exports = processMaturedInvestments;
