// const User = require("../models/User");
// const bcrypt = require("bcryptjs");

// // ============================
// // Get All Users
// // ============================

// exports.getAllUsers = async (req, res) => {
//   try {

//     const users = await User.find().select("-password");

//     res.json({
//       success: true,
//       count: users.length,
//       users,
//     });

//   } catch (error) {

//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });

//   }
// };

// // ============================
// // Get User By Id
// // ============================

// exports.getUserById = async (req, res) => {

//   try {

//     const user = await User.findById(req.params.id)
//       .select("-password");

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     res.json({
//       success: true,
//       user,
//     });

//   } catch (error) {

//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });

//   }

// };


// // ============================
// // Update User
// // ============================

// exports.updateUser = async (req, res) => {

//   try {

//     const user = await User.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       {
//         new: true,
//       }
//     ).select("-password");

//     res.json({
//       success: true,
//       message: "User Updated",
//       user,
//     });

//   } catch (error) {

//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });

//   }

// };

// // ============================
// // Delete User
// // ============================

// exports.deleteUser = async (req, res) => {

//   try {

//     await User.findByIdAndDelete(req.params.id);

//     res.json({
//       success: true,
//       message: "User Deleted",
//     });

//   } catch (error) {

//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });

//   }

// };

// // ============================
// // Block / Unblock
// // ============================

// exports.toggleUserStatus = async (req, res) => {

//   try {

//     const user = await User.findById(req.params.id);

//     user.isBlocked = !user.isBlocked;

//     await user.save();

//     res.json({
//       success: true,
//       message: user.isBlocked
//         ? "User Blocked"
//         : "User Activated",
//       user,
//     });

//   } catch (error) {

//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });

//   }

// };

// // ============================
// // Change User Password
// // ============================

// exports.changeUserPassword = async (req, res) => {
//   try {
//     const { newPassword } = req.body;

//     if (!newPassword) {
//       return res.status(400).json({
//         success: false,
//         message: "New password is required",
//       });
//     }

//     const user = await User.findById(req.params.id);

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }
    
//     // Hash new password
//     const hashedPassword = await bcrypt.hash(newPassword, 10);

//     user.password = hashedPassword;

//     await user.save();

//     res.status(200).json({
//       success: true,
//       message: "User password changed successfully",
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };


const User = require("../models/User");
const bcrypt = require("bcryptjs");

// ============================
// Create User
// ============================

exports.createUser = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      password,
      role,
      address,
    } = req.body;

    if (!fullName || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Full Name, Phone and Password are required",
      });
    }

    const existingPhone = await User.findOne({ phone });

    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: "Phone number already exists",
      });
    }

    if (email) {
      const existingEmail = await User.findOne({ email });

      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      phone,
      password: hashedPassword,
      role: role || "customer",
      address,
    });

    res.status(201).json({
      success: true,
      message: "Customer created successfully",
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
    const user = await User.findById(req.params.id).select("-password");

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
    const updateData = { ...req.body };

    // If password is being updated using findByIdAndUpdate,
    // hash it manually because pre("save") won't run.
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User Updated Successfully",
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
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================
// Block / Unblock User
// ============================

exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.isBlocked = !user.isBlocked;

    await user.save();

    res.json({
      success: true,
      message: user.isBlocked
        ? "User Blocked Successfully"
        : "User Activated Successfully",
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
// Change User Password
// ============================

exports.changeUserPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password is required",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Assign plain password.
    // User model pre("save") hook should hash it once.
    user.password = newPassword;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};