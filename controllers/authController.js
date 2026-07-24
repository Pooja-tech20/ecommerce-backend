const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const bcrypt = require("bcryptjs");

// Register
const register = async (req, res) => {
  console.log(req.body);
  try {
    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: "Request body is missing",
      });
    }

    const {
      fullName,
      phone,
      password,
      confirmPassword,
    } = req.body;

    if (!fullName || !phone || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    const phoneExists = await User.findOne({ phone });

    if (phoneExists) {
      return res.status(400).json({
        success: false,
        message: "Phone already exists",
      });
    }

    const user = await User.create({
      fullName,
      phone,
      password,
    });

    res.status(201).json({
      success: true,
      message: "Registration Successful",
      token: generateToken(user._id),
      user: {
        id: user._id,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role,
        image: user.image,
        address: user.address,
      },
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Login
const login = async (req, res) => {
  try {

  //  const { phone, password } = req.body;

  console.log("Headers:", req.headers);
console.log("Body:", req.body);

if (!req.body) {
  return res.status(400).json({
    success: false,
    message: "Request body is missing",
  });
}

const { phone, password } = req.body;


    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Phone and Password are required",
      });
    }

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid phone or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid phone or password",
      });
    }

    res.status(200).json({
      success: true,
      message: "Login Successful",
      token: generateToken(user._id),
      user: {
        id: user._id,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role,
        image: user.image,
        address: user.address,
      },
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



module.exports = {
  register,
  login,
};