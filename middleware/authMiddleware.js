// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// const protect = async (req, res, next) => {
//   try {
//     let token;

//     if (
//       req.headers.authorization &&
//       req.headers.authorization.startsWith("Bearer ")
//     ) {
//       token = req.headers.authorization.split(" ")[1];
//     }

//     console.log("TOKEN:", token);
//     console.log("JWT_SECRET:", process.env.JWT_SECRET);

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     console.log("DECODED:", decoded);

//     const user = await User.findById(decoded.id).select("-password");

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     console.log(error);

//     return res.status(401).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// module.exports = protect;


// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// const protect = async (req, res, next) => {
//   try {
//     let token;

//     if (
//       req.headers.authorization &&
//       req.headers.authorization.startsWith("Bearer ")
//     ) {
//       token = req.headers.authorization.split(" ")[1];
//     }

//     console.log("TOKEN:", token);
//     console.log("JWT_SECRET:", process.env.JWT_SECRET);

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     console.log("DECODED:", decoded);

//     const user = await User.findById(decoded.id).select("-password");

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     console.log(error);

//     return res.status(401).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// module.exports = protect;


const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ========================================
// Protect Middleware
// Verifies JWT token and attaches user to req
// ========================================
const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    console.log("TOKEN:", token);
    console.log("JWT_SECRET:", process.env.JWT_SECRET);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("DECODED:", decoded);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);

    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// Admin Only Middleware
// Must run AFTER protect (req.user must exist)
// ========================================
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Access denied. Admins only.",
  });
};

// ========================================
// Export both
// ========================================
module.exports = { protect, adminOnly };