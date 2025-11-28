require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    sendpulse_api_user_id: process.env.SENDPULSE_API_USER_ID,
    sendpulse_api_secret: process.env.SENDPULSE_API_SECRET,
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'elevatex_db_test',
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    sendpulse_api_user_id: process.env.SENDPULSE_API_USER_ID,
    sendpulse_api_secret: process.env.SENDPULSE_API_SECRET,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'elevatex_db_prod',
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    sendpulse_api_user_id: process.env.SENDPULSE_API_USER_ID,
    sendpulse_api_secret: process.env.SENDPULSE_API_SECRET,
  },
};
