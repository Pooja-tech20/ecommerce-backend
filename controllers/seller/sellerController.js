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

// ==================== GENERATE TOKEN ====================

const generateToken = (seller) => {
  return jwt.sign(
    {
      id: seller._id,
      role: "seller",
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

// ==================== REGISTER SELLER ====================

exports.registerSeller = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      storeName,
      address,
      city,
      state,
      pincode,
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !email ||
      !phone ||
      !password ||
      !storeName ||
      !address
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email, phone, password, store name and address are required",
      });
    }

    // Check if seller already exists
    const sellerExists = await Seller.findOne({
      $or: [
        { email: email.toLowerCase().trim() },
        { phone: phone.trim() },
      ],
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
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      password: hashedPassword,
      storeName: storeName.trim(),
      address: address.trim(),
      city: city ? city.trim() : "",
      state: state ? state.trim() : "",
      pincode: pincode ? pincode.trim() : "",
      status: "pending",
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      message:
        "Registration successful. Please wait for admin approval.",
      data: {
        id: seller._id,
        name: seller.name,
        storeName: seller.storeName,
        email: seller.email,
        phone: seller.phone,
        status: seller.status,
      },
    });
  } catch (error) {
    console.error("Register error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== LOGIN SELLER ====================

exports.loginSeller = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const seller = await Seller.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!seller) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, seller.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check seller status
    if (seller.status === "pending") {
      return res.status(403).json({
        success: false,
        message: "Your account is pending admin approval",
      });
    }

    if (seller.status === "rejected") {
      return res.status(403).json({
        success: false,
        message: "Your account has been rejected",
      });
    }

    if (seller.status === "blocked" || !seller.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked",
      });
    }

    // Generate token
    const token = generateToken(seller);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        seller: {
          id: seller._id,
          name: seller.name,
          storeName: seller.storeName,
          email: seller.email,
          phone: seller.phone,
          role: "seller",
          status: seller.status,
          logo: seller.logo || "",
        },
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== GET SELLER PROFILE ====================

exports.getSellerProfile = async (req, res) => {
  try {
    const seller = await Seller.findById(req.seller._id).select(
      "-password"
    );

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: seller,
    });
  } catch (error) {
    console.error("Get profile error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== UPDATE SELLER PROFILE ====================

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
      "name",
      "storeName",
      "phone",
      "address",
      "city",
      "state",
      "pincode",
      "logo",
      "description",
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

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: seller,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== CHANGE PASSWORD ====================

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "New password must be at least 6 characters long",
      });
    }

    const seller = await Seller.findById(req.seller._id);

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    const isMatch = await bcrypt.compare(
      currentPassword,
      seller.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    seller.password = await bcrypt.hash(newPassword, 10);

    await seller.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== LOGOUT ====================

exports.logoutSeller = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

// ==================== FORGOT PASSWORD ====================

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const seller = await Seller.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    const resetToken = jwt.sign(
      { id: seller._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
      ...(process.env.NODE_ENV === "development" && {
        resetToken,
      }),
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== RESET PASSWORD ====================

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Token and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "New password must be at least 6 characters long",
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

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    return res.status(500).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

// ==================== ADMIN: GET ALL SELLERS ====================

exports.getAllSellers = async (req, res) => {
  try {
    const sellers = await Seller.find()
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: sellers.length,
      data: sellers,
    });
  } catch (error) {
    console.error("Get all sellers error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch sellers",
      error: error.message,
    });
  }
};

// ==================== ADMIN: APPROVE SELLER ====================

exports.approveSeller = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id);

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    seller.status = "approved";
    seller.isActive = true;

    await seller.save();

    return res.status(200).json({
      success: true,
      message: "Seller approved successfully",
      data: seller,
    });
  } catch (error) {
    console.error("Approve seller error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to approve seller",
      error: error.message,
    });
  }
};

// ==================== ADMIN: REJECT SELLER ====================

exports.rejectSeller = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id);

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    seller.status = "rejected";
    seller.isActive = false;

    await seller.save();

    return res.status(200).json({
      success: true,
      message: "Seller rejected successfully",
      data: seller,
    });
  } catch (error) {
    console.error("Reject seller error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to reject seller",
      error: error.message,
    });
  }
};

