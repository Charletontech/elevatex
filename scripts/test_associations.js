const { User, Investment } = require('../models');
const sequelize = require('../config/database');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');

    // Test Investment.belongsTo(User) - Alias 'user'
    // We don't need actual data, just checking if the query generation throws an error
    try {
        await Investment.findOne({
            include: [{ model: User, as: 'user' }]
        });
        console.log('Investment -> User association works with alias "user".');
    } catch (err) {
        console.error('Investment -> User association failed:', err.message);
    }

    // Test User.hasMany(Investment) - Default alias (usually 'Investments')
    try {
        await User.findOne({
            include: [{ model: Investment }]
        });
        console.log('User -> Investment association works with default alias.');
    } catch (err) {
        console.error('User -> Investment association failed:', err.message);
    }

  } catch (error) {
    console.error('Setup failed:', error);
  } finally {
    await sequelize.close();
  }
})();
