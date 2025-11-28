require("dotenv").config();
const bcrypt = require("bcryptjs");
const { User } = require("../models");
const sequelize = require("../config/database");

const seedAdmin = async () => {
  try {
    await sequelize.sync();

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminUsername || !adminPassword) {
      console.error(
        "Please provide ADMIN_EMAIL, ADMIN_USERNAME, and ADMIN_PASSWORD in your .env file"
      );
      return;
    }

    const [admin, created] = await User.findOrCreate({
      where: { email: adminEmail },
      defaults: {
        fullname: "Admin User",
        email: adminEmail,
        username: adminUsername,
        password: await bcrypt.hash(adminPassword, 10),
        phone: "0000000000",
        country: "N/A",
        agreeTerms: true,
        isAdmin: true,
      },
    });

    if (created) {
      console.log("Admin user created successfully!");
    } else {
      console.log("Admin user already exists.");
    }
  } catch (error) {
    console.error("Error seeding admin user:", error);
  } finally {
    await sequelize.close();
  }
};

seedAdmin();
