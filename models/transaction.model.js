const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Transaction = sequelize.define("Transaction", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  type: {
    type: DataTypes.STRING, // e.g., 'deposit', 'withdrawal', 'investment', 'roi'
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING, // e.g., 'pending', 'approved', 'declined'
    defaultValue: "pending",
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  screenshot: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  screenshotPublicId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

// Hook to remove remote file when a transaction is destroyed
Transaction.addHook("afterDestroy", async (transaction, options) => {
  try {
    if (transaction.screenshotPublicId) {
      const { removeRemoteFile } = require("../services/cloudinary.service");
      await removeRemoteFile(transaction.screenshotPublicId);
    }
  } catch (err) {
    // Log and continue
    console.error("Failed to remove remote file for deleted transaction:", err);
  }
});

module.exports = Transaction;
