const User = require("../models/User");

// ============================
// Get All Users
// ============================

exports.getAllUsers = async (req, res) => {
  try {

    const users = await User.find().select("-password");

    res.json({
      success: true,
      count: users.length,
      users,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ============================
// Get User By Id
// ============================

exports.getUserById = async (req, res) => {

  try {

    const user = await User.findById(req.params.id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ============================
// Update User
// ============================

exports.updateUser = async (req, res) => {

  try {

    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    ).select("-password");

    res.json({
      success: true,
      message: "User Updated",
      user,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ============================
// Delete User
// ============================

exports.deleteUser = async (req, res) => {

  try {

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "User Deleted",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ============================
// Block / Unblock
// ============================

exports.toggleUserStatus = async (req, res) => {

  try {

    const user = await User.findById(req.params.id);

    user.isBlocked = !user.isBlocked;

    await user.save();

    res.json({
      success: true,
      message: user.isBlocked
        ? "User Blocked"
        : "User Activated",
      user,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};