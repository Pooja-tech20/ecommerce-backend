const Seller = require("../../models/seller/Seller");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate Token
const generateToken = (seller) => {
  return jwt.sign(
    {
      id: seller._id,
      role: seller.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};
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

    if (
      !shopName ||
      !ownerName ||
      !email ||
      !phone ||
      !password ||
      !address
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields are mandatory",
      });
    }

    const sellerExists = await Seller.findOne({
      $or: [{ email }, { phone }],
    });

    if (sellerExists) {
      return res.status(400).json({
        success: false,
        message: "Seller already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const seller = await Seller.create({
      shopName,
      ownerName,
      email,
      phone,
      password: hashedPassword,
      address,
      gstNumber,
      panNumber,
    });

    res.status(201).json({
      success: true,
      message: "Registration successful. Wait for admin approval.",
      seller,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.loginSeller = async (req, res) => {
  try {
    const { email, password } = req.body;

    const seller = await Seller.findOne({ email });

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    const isMatch = await bcrypt.compare(password, seller.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (seller.status !== "Approved") {
      return res.status(403).json({
        success: false,
        message: "Your account is not approved yet.",
      });
    }

    if (seller.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked.",
      });
    }

    const token = generateToken(seller);

    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      seller: {
        id: seller._id,
        shopName: seller.shopName,
        ownerName: seller.ownerName,
        email: seller.email,
        phone: seller.phone,
        role: seller.role,
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
exports.getSellerProfile = async (req, res) => {
  try {
    const seller = await Seller.findById(req.seller._id).select("-password");

    res.status(200).json({
      success: true,
      seller,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.updateSellerProfile = async (req, res) => {
  try {
    const seller = await Seller.findById(req.seller._id);

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    seller.shopName = req.body.shopName || seller.shopName;
    seller.ownerName = req.body.ownerName || seller.ownerName;
    seller.phone = req.body.phone || seller.phone;
    seller.address = req.body.address || seller.address;
    seller.gstNumber = req.body.gstNumber || seller.gstNumber;
    seller.panNumber = req.body.panNumber || seller.panNumber;

    await seller.save();

    res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      seller,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const seller = await Seller.findById(req.seller._id);

    const match = await bcrypt.compare(
      currentPassword,
      seller.password
    );

    if (!match) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    seller.password = await bcrypt.hash(newPassword, 10);

    await seller.save();

    res.status(200).json({
      success: true,
      message: "Password Changed Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};