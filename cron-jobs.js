require("dotenv").config();

const fs = require("fs");
const path = require("path");

const processMaturedInvestments = require("./scripts/process_investments");
const sequelize = require("./config/database");

// Paths
const LOCK_FILE = "/tmp/elevatex-investment-cron.lock";
const LOG_FILE = path.join(__dirname, "cron.log");

// Simple logger
function log(message) {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(LOG_FILE, `[${timestamp}] ${message}\n`);
}

(async () => {
  // Prevent overlapping runs
  if (fs.existsSync(LOCK_FILE)) {
    log("Cron already running. Exiting.");
    process.exit(0);
  }

  // Create lock file
  fs.writeFileSync(LOCK_FILE, process.pid.toString());

  log("Cron job started: processing matured investments.");

  try {
    await sequelize.authenticate();
    await processMaturedInvestments();
    log("Cron job completed successfully.");
  } catch (error) {
    log(`Cron job failed: ${error.stack || error.message}`);
  } finally {
    try {
      await sequelize.close();
      log("Database connection closed.");
    } catch (err) {
      log(`Failed to close database connection: ${err.message}`);
    }

    // Remove lock file
    if (fs.existsSync(LOCK_FILE)) {
      fs.unlinkSync(LOCK_FILE);
    }

    process.exit(0);
  }
})();
