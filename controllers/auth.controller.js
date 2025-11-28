const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const User = require("../models/user.model");
const { UniqueConstraintError } = require("sequelize");
const {
  sendWelcomeEmail,
  sendForgotPasswordEmail,
} = require("../services/email.service");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_RESET_SECRET = process.env.JWT_RESET_SECRET;

const signup = async (req, res) => {
  const {
    fullname,
    email,
    phone,
    username,
    password,
    country,
    referralCode,
    agreeTerms,
  } = req.body;

  // Validation already handled by middleware
  if (
    !username ||
    !password ||
    !fullname ||
    !email ||
    !phone ||
    !country ||
    !agreeTerms
  ) {
    return res
      .status(400)
      .json({ message: "All required fields must be provided." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      fullname,
      email,
      phone,
      username,
      password: hashedPassword,
      country,
      referralCode,
      agreeTerms,
    });

    // Send welcome email but don't block the response if it fails
    try {
      await sendWelcomeEmail(newUser);
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
      // This error is logged for the admin but not sent to the user, as signup was successful.
    }

    const token = jwt.sign(
      { id: newUser.id, username: newUser.username, isAdmin: newUser.isAdmin },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(201).json({ message: "User registered successfully!", token });
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      const field = error.errors[0].path;
      return res.status(400).json({ message: `${field} already exists.` });
    }
    console.error("Signup error:", error);
    res.status(500).json({
      message: "An error occurred during registration. Please try again.",
    });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username/Email and password are required." });
  }

  try {
    const user = await User.findOne({
      where: {
        [Op.or]: [{ username: username }, { email: username }],
      },
    });

    if (!user) {
      console.log(
        "Login attempt failed: User not found for username/email:",
        username
      );
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    console.log(
      "Password comparison result for user",
      user.username,
      ":",
      isMatch
    );

    if (!isMatch) {
      console.log(
        "Login attempt failed: Password mismatch for user:",
        user.username
      );
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, isAdmin: user.isAdmin },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ message: "Logged in successfully!", token });
  } catch (error) {
    console.error("Login error:", error);
    res
      .status(500)
      .json({ message: "An error occurred during login. Please try again." });
  }
};

const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ message: "Current password and new password are required." });
  }

  try {
    const user = await User.findByPk(req.user.id);
    if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
      return res.status(401).json({ message: "Invalid current password." });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.status(200).json({ message: "Password updated successfully!" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      message: "An error occurred while changing password. Please try again.",
    });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email address is required." });
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(200).json({
        message:
          "If a user with that email exists, a password reset link has been sent.",
      });
    }

    const resetToken = jwt.sign({ id: user.id }, JWT_RESET_SECRET, {
      expiresIn: "1h",
    });
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/change-password/index.html?token=${resetToken}`;

    await sendForgotPasswordEmail(user, resetUrl);

    res.status(200).json({
      message:
        "If a user with that email exists, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res
      .status(500)
      .json({ message: "An error occurred. Error: " + error.message });
  }
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res
      .status(400)
      .json({ message: "Token and new password are required." });
  }

  try {
    const decoded = jwt.verify(token, JWT_RESET_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid token or user does not exist." });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password has been reset successfully." });
  } catch (error) {
    console.error("Reset password error:", error);
    if (error instanceof jwt.TokenExpiredError) {
      return res
        .status(400)
        .json({ message: "Password reset token has expired." });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({ message: "Invalid password reset token." });
    }
    res
      .status(500)
      .json({ message: "An error occurred while resetting your password." });
  }
};

module.exports = {
  signup,
  login,
  changePassword,
  forgotPassword,
  resetPassword,
};
