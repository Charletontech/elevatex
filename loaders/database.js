const sequelize = require("../config/database");

// database class
class Database {
  static async connect() {
    try {
      await sequelize.authenticate();
      console.log("Database connected...");
    } catch (err) {
      console.error("Unable to connect to the database:", err);
    }
  }

  static async sync() {
    try {
      await sequelize.sync({ alter: true });
      console.log("Database synchronized!");
    } catch (err) {
      console.error("Error synchronizing database:", err);
    }
  }
}

module.exports = Database;
