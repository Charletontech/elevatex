const { Op } = require("sequelize");
const sequelize = require("../config/database");
const { Investment, User, Notification } = require("../models");

const processMaturedInvestments = async () => {
  console.log("Cron Job: Starting to process matured investments...");

  const transaction = await sequelize.transaction();

  try {
    const maturedInvestments = await Investment.findAll({
      where: {
        status: 'active',
        maturityDate: {
          [Op.lte]: new Date()
        }
      },
      include: [{ model: User, as: 'user' }]
    }, { transaction });

    if (maturedInvestments.length === 0) {
      console.log("Cron Job: No matured investments to process.");
      await transaction.commit();
      return;
    }

    for (const investment of maturedInvestments) {
      console.log(`Cron Job: Processing investment ID: ${investment.id} for user ID: ${investment.userId}`);

      // 1. Credit user's balance
      const user = investment.user;
      
      const returns = parseFloat(investment.returns);
      if (isNaN(returns)) {
          console.error(`Cron Job: Invalid 'returns' value for investment ID: ${investment.id}. Skipping.`);
          continue; 
      }

      user.balance = parseFloat(user.balance) + returns;
      await user.save({ transaction });

      // 2. Mark investment as completed
      investment.status = 'completed';
      await investment.save({ transaction });

      // 3. Create notification
      const message = `Your investment of $${investment.amount} has matured. Your account has been credited with $${returns}.`;
      await Notification.create({
        userId: user.id,
        message: message,
      }, { transaction });
      
      console.log(`Cron Job: Successfully processed investment ID: ${investment.id}. User ${user.email} credited with ${returns}.`);
    }

    await transaction.commit();
    console.log(`Cron Job: Successfully processed ${maturedInvestments.length} investments.`);

  } catch (error) {
    await transaction.rollback();
    console.error("Cron Job: Error processing matured investments:", error);
  }
};

// This allows the script to be run directly for testing
if (require.main === module) {
  sequelize.authenticate()
    .then(() => {
        console.log('Database connected for standalone script run...');
        processMaturedInvestments().then(() => {
            console.log('Standalone script run finished.');
            sequelize.close();
        });
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });
}


module.exports = processMaturedInvestments;
