// // const jwt = require("jsonwebtoken");
// // const Seller = require("../../models/seller/Seller");
// // exports.sellerAuth = async (req, res, next) => {
// //   try {
// //     let token;

// //     if (
// //       req.headers.authorization &&
// //       req.headers.authorization.startsWith("Bearer")
// //     ) {
// //       token = req.headers.authorization.split(" ")[1];
// //     }

// //     if (!token) {
// //       return res.status(401).json({
// //         success: false,
// //         message: "Unauthorized. No token provided.",
// //       });
// //     }

// //     const decoded = jwt.verify(token, process.env.JWT_SECRET);

// //     const seller = await Seller.findById(decoded.id).select("-password");

// //     if (!seller) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Seller not found.",
// //       });
// //     }

// //     if (seller.status !== "Approved") {
// //       return res.status(403).json({
// //         success: false,
// //         message: "Seller is not approved.",
// //       });
// //     }

// //     if (seller.isBlocked) {
// //       return res.status(403).json({
// //         success: false,
// //         message: "Seller account is blocked.",
// //       });
// //     }

// //     req.seller = seller;

// //     next();
// //   } catch (error) {
// //     res.status(401).json({
// //       success: false,
// //       message: "Invalid Token",
// //     });
// //   }
// // };
// const jwt = require("jsonwebtoken");
// const Seller = require("../../models/seller/Seller");

// const sellerAuth = async (req, res, next) => {
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
//         message: "Unauthorized",
//       });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const seller = await Seller.findById(decoded.id).select("-password");

//     if (!seller) {
//       return res.status(404).json({
//         success: false,
//         message: "Seller not found",
//       });
//     }

//     req.seller = seller;

//     next();
//   } catch (err) {
//     console.log("sellerAuth error:", err.message); // TEMP DEBUG — remove after fixing
//     return res.status(401).json({
//       success: false,
//       message: "Invalid Token",
//     });
//   }
// };

// module.exports = sellerAuth;

const jwt = require("jsonwebtoken");
const Seller = require("../../models/seller/Seller");

const sellerAuth = async (req, res, next) => {
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
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const seller = await Seller.findById(decoded.id).select("-password");

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    req.seller = seller;

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

const isAdmin = (req, res, next) => {
  if (req.seller.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin only",
    });
  }

  next();
};

module.exports = {
  sellerAuth,
  isAdmin,
};