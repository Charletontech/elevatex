const { body, validationResult } = require('express-validator');

const validateSignup = [
  body('fullname').notEmpty().withMessage('Full name is required.'),
  body('email').isEmail().withMessage('Please provide a valid email address.'),
  body('phone').notEmpty().withMessage('Phone number is required.'),
  body('username').notEmpty().withMessage('Username is required.'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
  body('country').notEmpty().withMessage('Country is required.'),
  body('agreeTerms').isBoolean().withMessage('You must agree to the terms and conditions.'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateLogin = [
    body('username').notEmpty().withMessage('Username is required.'),
    body('password').notEmpty().withMessage('Password is required.'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validateDeposit = [
    body('amount').isFloat({ gt: 0 }).withMessage('Amount must be a positive number.'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validateWithdrawal = [
    body('amount').isFloat({ gt: 0 }).withMessage('Amount must be a positive number.'),
    body('paymentMethod').notEmpty().withMessage('Payment method is required.'),
    body('walletAddress').notEmpty().withMessage('Wallet address is required.'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validateLoan = [
    body('amount').isFloat({ gt: 0 }).withMessage('Amount must be a positive number.'),
    body('reason').notEmpty().withMessage('Reason is required.'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
  validateSignup,
  validateLogin,
  validateDeposit,
  validateWithdrawal,
  validateLoan
};
