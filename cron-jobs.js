const processMaturedInvestments = require('./scripts/process_investments');
const sequelize = require('./config/database');

module.exports = async (req, res) => {
  console.log('Cron job triggered: processing matured investments.');
  try {
    // Ensure database is connected before running the job
    await sequelize.authenticate();
    await processMaturedInvestments();
    res.status(200).send('Cron job executed successfully.');
  } catch (error) {
    console.error('Cron job failed to connect to database or run processing script:', error);
    res.status(500).send('Cron job failed.');
  }
};

