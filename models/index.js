const User = require('./user.model');
const Investment = require('./investment.model');
const Transaction = require('./transaction.model');
const Loan = require('./loan.model');
const Notification = require('./notification.model');

User.hasMany(Investment, { foreignKey: 'userId' });
Investment.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Transaction, { foreignKey: 'userId' });
Transaction.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Loan, { foreignKey: 'userId' });
Loan.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Notification, { foreignKey: 'userId' });
Notification.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  User,
  Investment,
  Transaction,
  Loan,
  Notification,
};
