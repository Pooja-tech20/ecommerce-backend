const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

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
    console.error(error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = protect;


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

//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "No token provided",
//       });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     console.log("🔐 JWT decoded:", decoded);

//     const userId = decoded.id || decoded.userId || decoded._id;

//     console.log("👤 User ID from token:", userId);

//     if (!userId) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid token: user ID missing",
//       });
//     }

//     const user = await User.findById(userId).select("-password");

//     console.log("👤 User found:", user ? user._id : "NO USER");

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "User associated with token not found",
//       });
//     }

//     req.user = user;

//     next();
//   } catch (error) {
//     console.error("❌ Protect middleware error:", error);

//     return res.status(401).json({
//       success: false,
//       message: "Invalid or expired token",
//     });
//   }
// };

// module.exports = protect;