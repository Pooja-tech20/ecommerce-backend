// const Seller = require("../../models/seller/Seller");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// // Generate Token
// const generateToken = (seller) => {
//   return jwt.sign(
//     {
//       id: seller._id,
//       role: seller.role,
//     },
//     process.env.JWT_SECRET,
//     {
//       expiresIn: "7d",
//     }
//   );
// };
// exports.registerSeller = async (req, res) => {
//   try {
//     const {
//       shopName,
//       ownerName,
//       email,
//       phone,
//       password,
//       address,
//       gstNumber,
//       panNumber,
//     } = req.body;

//     if (
//       !shopName ||
//       !ownerName ||
//       !email ||
//       !phone ||
//       !password ||
//       !address
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "All required fields are mandatory",
//       });
//     }

//     const sellerExists = await Seller.findOne({
//       $or: [{ email }, { phone }],
//     });

//     if (sellerExists) {
//       return res.status(400).json({
//         success: false,
//         message: "Seller already exists",
//       });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const seller = await Seller.create({
//       shopName,
//       ownerName,
//       email,
//       phone,
//       password: hashedPassword,
//       address,
//       gstNumber,
//       panNumber,
//     });

//     res.status(201).json({
//       success: true,
//       message: "Registration successful. Wait for admin approval.",
//       seller,
//     });
//   } catch (error) {
//     console.log(error);

//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
// exports.loginSeller = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const seller = await Seller.findOne({ email });

//     if (!seller) {
//       return res.status(404).json({
//         success: false,
//         message: "Seller not found",
//       });
//     }

//     const isMatch = await bcrypt.compare(password, seller.password);

//     if (!isMatch) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid credentials",
//       });
//     }

//     if (seller.status !== "Approved") {
//       return res.status(403).json({
//         success: false,
//         message: "Your account is not approved yet.",
//       });
//     }

//     if (seller.isBlocked) {
//       return res.status(403).json({
//         success: false,
//         message: "Your account has been blocked.",
//       });
//     }

//     const token = generateToken(seller);

//     res.status(200).json({
//       success: true,
//       message: "Login Successful",
//       token,
//       seller: {
//         id: seller._id,
//         shopName: seller.shopName,
//         ownerName: seller.ownerName,
//         email: seller.email,
//         phone: seller.phone,
//         role: seller.role,
//       },
//     });
//   } catch (error) {
//     console.log(error);

//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
// exports.getSellerProfile = async (req, res) => {
//   try {
//     const seller = await Seller.findById(req.seller._id).select("-password");

//     res.status(200).json({
//       success: true,
//       seller,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
// exports.updateSellerProfile = async (req, res) => {
//   try {
//     const seller = await Seller.findById(req.seller._id);

//     if (!seller) {
//       return res.status(404).json({
//         success: false,
//         message: "Seller not found",
//       });
//     }

//     seller.shopName = req.body.shopName || seller.shopName;
//     seller.ownerName = req.body.ownerName || seller.ownerName;
//     seller.phone = req.body.phone || seller.phone;
//     seller.address = req.body.address || seller.address;
//     seller.gstNumber = req.body.gstNumber || seller.gstNumber;
//     seller.panNumber = req.body.panNumber || seller.panNumber;

//     await seller.save();

//     res.status(200).json({
//       success: true,
//       message: "Profile Updated Successfully",
//       seller,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// exports.changePassword = async (req, res) => {
//   try {
//     const { currentPassword, newPassword } = req.body;

//     const seller = await Seller.findById(req.seller._id);

//     const match = await bcrypt.compare(
//       currentPassword,
//       seller.password
//     );

//     if (!match) {
//       return res.status(400).json({
//         success: false,
//         message: "Current password is incorrect",
//       });
//     }

//     seller.password = await bcrypt.hash(newPassword, 10);

//     await seller.save();

//     res.status(200).json({
//       success: true,
//       message: "Password Changed Successfully",
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

const Seller = require("../../models/seller/Seller");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate Token
const generateToken = (seller) => {
  return jwt.sign(
    {
      id: seller._id,
      role: seller.role || "seller",
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

// ==================== AUTH CONTROLLERS ====================

// 📝 Register Seller
exports.registerSeller = async (req, res) => {
  try {
    const {
      shopName,
      ownerName,
      email,
      phone,
      password,
      address,
      gstNumber,
      panNumber,
    } = req.body;

    // Validate required fields
    if (!shopName || !ownerName || !email || !phone || !password || !address) {
      return res.status(400).json({
        success: false,
        message: "All required fields are mandatory",
      });
    }

    // Check if seller exists
    const sellerExists = await Seller.findOne({
      $or: [{ email }, { phone }],
    });

    if (sellerExists) {
      return res.status(400).json({
        success: false,
        message: "Seller already exists with this email or phone",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create seller
    const seller = await Seller.create({
      shopName,
      ownerName,
      email,
      phone,
      password: hashedPassword,
      address,
      gstNumber,
      panNumber,
      status: "Pending",
    });

    res.status(201).json({
      success: true,
      message: "Registration successful. Please wait for admin approval.",
      data: {
        id: seller._id,
        shopName: seller.shopName,
        ownerName: seller.ownerName,
        email: seller.email,
        phone: seller.phone,
        status: seller.status,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 🔐 Login Seller
exports.loginSeller = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const seller = await Seller.findOne({ email });

    if (!seller) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, seller.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check status
    if (seller.status === "Pending") {
      return res.status(403).json({
        success: false,
        message: "Your account is pending approval",
      });
    }

    if (seller.status === "Rejected") {
      return res.status(403).json({
        success: false,
        message: "Your account has been rejected",
      });
    }

    if (seller.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked",
      });
    }

    const token = generateToken(seller);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        seller: {
          id: seller._id,
          shopName: seller.shopName,
          ownerName: seller.ownerName,
          email: seller.email,
          phone: seller.phone,
          role: seller.role || "seller",
          status: seller.status,
          logo: seller.logo || "",
        },
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 👤 Get Seller Profile
exports.getSellerProfile = async (req, res) => {
  try {
    const seller = await Seller.findById(req.seller._id).select("-password");

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    res.status(200).json({
      success: true,
      data: seller,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✏️ Update Seller Profile
exports.updateSellerProfile = async (req, res) => {
  try {
    const seller = await Seller.findById(req.seller._id);

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    const allowedUpdates = [
      "shopName",
      "ownerName",
      "phone",
      "address",
      "gstNumber",
      "panNumber",
      "logo",
      "shopDescription",
    ];

    let updated = false;
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        seller[field] = req.body[field];
        updated = true;
      }
    });

    if (!updated) {
      return res.status(400).json({
        success: false,
        message: "No valid fields to update",
      });
    }

    await seller.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: seller,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 🔑 Change Password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long",
      });
    }

    const seller = await Seller.findById(req.seller._id);

    const isMatch = await bcrypt.compare(currentPassword, seller.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    seller.password = await bcrypt.hash(newPassword, 10);
    await seller.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 🚪 Logout
exports.logoutSeller = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

// 🔄 Forgot Password (Optional)
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const seller = await Seller.findOne({ email });

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { id: seller._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // TODO: Send email with reset link
    // await sendResetEmail(seller.email, resetToken);

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
      // Only return token in development
      ...(process.env.NODE_ENV === "development" && { resetToken }),
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 🔑 Reset Password (Optional)
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Token and new password are required",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const seller = await Seller.findById(decoded.id);

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    seller.password = await bcrypt.hash(newPassword, 10);
    await seller.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};