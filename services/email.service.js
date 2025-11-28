const axios = require("axios");
const base64 = require("base-64");

const CLIENT_ID = process.env.SENDPULSE_API_USER_ID;
const CLIENT_SECRET = process.env.SENDPULSE_API_SECRET;

const getAccessToken = async () => {
  try {
    const res = await axios.post(
      "https://api.sendpulse.com/oauth/access_token",
      {
        grant_type: "client_credentials",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }
    );
    return res.data.access_token;
  } catch (error) {
    console.error(
      "Error getting SendPulse access token:",
      error.response ? error.response.data : error
    );
    throw error;
  }
};

const sendEmail = async (to, subject, html) => {
  try {
    const token = await getAccessToken();

    const emailData = {
      email: {
        html: base64.encode(html),
        subject,
        from: {
          name: process.env.FROM_NAME,
          email: process.env.FROM_EMAIL,
          // name: "ElevateX Assets",
          // email: "support@elevatex.com",
        },
        to: [
          {
            email: to,
          },
        ],
      },
    };

    const res = await axios.post(
      "https://api.sendpulse.com/smtp/emails",
      emailData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Email sent successfully:", res.data);
  } catch (error) {
    console.error(
      "❌ Email send error:",
      error.response ? error.response.data : error
    );
    throw error;
  }
};

const {
  getWelcomeEmailTemplate,
  getForgotPasswordEmailTemplate,
  getDepositApprovedEmailTemplate,
  getDepositDeclinedEmailTemplate,
  getWithdrawalApprovedEmailTemplate,
  getWithdrawalDeclinedEmailTemplate,
  getLoanApprovedEmailTemplate,
  getLoanDeclinedEmailTemplate,
  getCustomEmailTemplate,
} = require("../models/email.templates.js");

const sendWelcomeEmail = (user) => {
  const html = getWelcomeEmailTemplate(user);
  return sendEmail(user.email, "Welcome to ElevateX Assets", html);
};

const sendForgotPasswordEmail = (user, resetUrl) => {
  const html = getForgotPasswordEmailTemplate(user, resetUrl);
  return sendEmail(user.email, "Reset Your Password", html);
};

const sendDepositApprovedEmail = (user, transaction) => {
  const html = getDepositApprovedEmailTemplate(user, transaction);
  return sendEmail(user.email, "Deposit Approved", html);
};

const sendDepositDeclinedEmail = (user, transaction) => {
  const html = getDepositDeclinedEmailTemplate(user, transaction);
  return sendEmail(user.email, "Deposit Declined", html);
};

const sendWithdrawalApprovedEmail = (user, transaction) => {
  const html = getWithdrawalApprovedEmailTemplate(user, transaction);
  return sendEmail(user.email, "Withdrawal Approved", html);
};

const sendWithdrawalDeclinedEmail = (user, transaction) => {
  const html = getWithdrawalDeclinedEmailTemplate(user, transaction);
  return sendEmail(user.email, "Withdrawal Declined", html);
};

const sendLoanApprovedEmail = (user, loan) => {
  const html = getLoanApprovedEmailTemplate(user, loan);
  return sendEmail(user.email, "Loan Application Approved", html);
};

const sendLoanDeclinedEmail = (user, loan) => {
  const html = getLoanDeclinedEmailTemplate(user, loan);
  return sendEmail(user.email, "Loan Application Declined", html);
};

const sendCustomEmail = (recipient, subject, message) => {
  const html = getCustomEmailTemplate(recipient, subject, message);
  return sendEmail(recipient.email, subject, html);
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendForgotPasswordEmail,
  sendDepositApprovedEmail,
  sendDepositDeclinedEmail,
  sendWithdrawalApprovedEmail,
  sendWithdrawalDeclinedEmail,
  sendLoanApprovedEmail,
  sendLoanDeclinedEmail,
  sendCustomEmail,
};
