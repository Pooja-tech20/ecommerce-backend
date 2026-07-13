const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// =========================
// Admin Register
// =========================
exports.adminRegister = async (req, res) => {
    try {
        const {
            fullName,
            email,
            password,
            confirmPassword
        } = req.body;

        // Check required fields
        if (!fullName || !email || !password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Check password match
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match"
            });
        }

        // Check if admin already exists
        const adminExist = await User.findOne({ email });

        if (adminExist) {
            return res.status(400).json({
                success: false,
                message: "Admin already exists"
            });
        }
      
        // Create Admin
        const admin = await User.create({
            fullName,
            email,
            password: Password,
            role: "admin"
        });

        res.status(201).json({
            success: true,
            message: "Admin Registered Successfully",
            admin: {
                id: admin._id,
                fullName: admin.fullName,
                email: admin.email,
                role: admin.role
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// =========================
// Admin Login
// =========================
exports.adminLogin = async (req, res) => {
    try {

        const { email, password } = req.body;

        // Check required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and Password are required"
            });
        }

        // Find Admin
        const admin = await User.findOne({
            email,
            role: "admin"
        });

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }

        // Compare Password
        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid Password"
            });
        }

        // Generate JWT Token
        const token = jwt.sign(
            {
                id: admin._id,
                role: admin.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        // Login Success
        res.status(200).json({
            success: true,
            message: "Admin Login Successful",
            token,
            admin: {
                id: admin._id,
                fullName: admin.fullName,
                email: admin.email,
                role: admin.role
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};