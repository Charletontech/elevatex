const cron = require('node-cron');
const processMaturedInvestments = require('./scripts/process_investments');
const sequelize = require('./config/database');

// Schedule the cron job to run at the top of every hour
cron.schedule('0 * * * *', async () => {
  console.log('Cron job triggered: processing matured investments.');
  try {
    // Ensure database is connected before running the job
    await sequelize.authenticate();
    await processMaturedInvestments();
  } catch (error) {
    console.error('Cron job failed to connect to database or run processing script:', error);
  }
}, {
  scheduled: true,
  timezone: "UTC" // Or your server's timezone
});

console.log('Cron job for processing investments has been scheduled to run every hour.');
