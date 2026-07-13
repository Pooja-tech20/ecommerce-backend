const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const bcrypt = require("bcryptjs");

// Register User

const register = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword } = req.body;

    // Check required fields
    if (!fullName || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check password match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // Check existing user
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Create new user
    const user = await User.create({
      fullName,
      email,
      password,
    });

    // Response
    res.status(201).json({
      success: true,
      message: "Registration successful",
      token: generateToken(user._id),
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
     console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Login User

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Compare password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Response
    res.status(200).json({
      success: true,
      message: "Login successful",
      token: generateToken(user._id),
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Admin Login

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find admin only
    const admin = await User.findOne({
      email,
      role: "admin",
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Admin not found",
      });
    }

    // Compare password
console.log("Entered Password:", password);
console.log("Stored Password:", admin.password);

const isMatch = await admin.matchPassword(password);

console.log("Password Match:", isMatch);

if (!isMatch) {
  return res.status(401).json({
    success: false,
    message: "Invalid email or password",
  });
}
    // Success
    res.status(200).json({
      success: true,
      message: "Admin login successful",
      token: generateToken(admin._id),
      user: {
        id: admin._id,
        fullName: admin.fullName,
        email: admin.email,
        role: admin.role,
      },
    });

  } catch (error) {
    console.error("ADMIN LOGIN ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Export Controllers

module.exports = {
  register,
  login,
  adminLogin,
};
