const {
  User,
  Investment,
  Transaction,
  Loan,
  Notification,
} = require("../models");

const getDashboardData = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [
        {
          model: Investment,
          separate: true,
          limit: 5,
          order: [["createdAt", "DESC"]],
        },
        {
          model: Transaction,
          separate: true,
          limit: 5,
          order: [["createdAt", "DESC"]],
        },
        {
          model: Loan,
          separate: true,
          limit: 5,
          order: [["createdAt", "DESC"]],
        },
        {
          model: Notification,
          separate: true,
          limit: 5,
          order: [["createdAt", "DESC"]],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Get dashboard data error:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching dashboard data." });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] }, // Exclude password from profile data
    });

    if (!user) {
      return res.status(404).json({ message: "User profile not found." });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Get profile error:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching user profile." });
  }
};

const updateProfile = async (req, res) => {
  const { fullname, phone, country, address } = req.body;
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.fullname = fullname || user.fullname;
    user.phone = phone || user.phone;
    user.country = country || user.country;
    user.address = address || user.address; // Assuming 'address' field exists in User model

    await user.save();
    res.status(200).json({ message: "Profile updated successfully!", user });
  } catch (error) {
    console.error("Update profile error:", error);
    res
      .status(500)
      .json({ message: "An error occurred while updating user profile." });
  }
};

module.exports = {
  getDashboardData,
  getProfile,
  updateProfile,
};
