const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");

async function addColumns() {
  const qi = sequelize.getQueryInterface();
  try {
    await sequelize.authenticate();
    console.log("DB connected — checking/adding columns...");

    // Add startDate if not exists
    try {
      await qi.addColumn("Investments", "startDate", {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      });
      console.log("Added column: startDate");
    } catch (err) {
      if (err && err.original && err.original.errno === 1060) {
        console.log("Column startDate already exists");
      } else {
        throw err;
      }
    }

    // Add maturityDate if not exists
    try {
      await qi.addColumn("Investments", "maturityDate", {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      });
      console.log("Added column: maturityDate");
    } catch (err) {
      if (err && err.original && err.original.errno === 1060) {
        console.log("Column maturityDate already exists");
      } else {
        throw err;
      }
    }

    console.log("Done.");
    process.exit(0);
  } catch (error) {
    console.error("Failed to add columns:", error);
    process.exit(1);
  }
}

addColumns();
