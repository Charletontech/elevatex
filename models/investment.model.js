const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Investment = sequelize.define("Investment", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  planName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  maturityDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  roi: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  returns: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "active", // e.g., 'active', 'matured'
  },
});

module.exports = Investment;
