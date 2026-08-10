// // // const express = require("express");

// // // const router = express.Router();

// // // const {
// // //   registerSeller,
// // //   loginSeller,
// // //   getSellerProfile,
// // //   updateSellerProfile,
// // //   changePassword,
// // // } = require("../../controllers/seller/sellerController");

// // // const { sellerAuth } = require("../../middleware/seller/sellerAuth");

// // // router.post("/register", registerSeller);

// // // router.post("/login", loginSeller);

// // // router.get("/profile", sellerAuth, getSellerProfile);

// // // router.put("/profile", sellerAuth, updateSellerProfile);

// // // router.put("/change-password", sellerAuth, changePassword);

// // // module.exports = router;

// // const express = require("express");
// // const router = express.Router();
// // const {
// //   registerSeller,
// //   loginSeller,
// //   getSellerProfile,
// //   updateSellerProfile,
// //   changePassword,
// //   logoutSeller,
// //   forgotPassword,
// //   resetPassword,
// // } = require("../../controllers/seller/sellerController"); // ✅ Fixed path

// // // ==================== PUBLIC ROUTES ====================
// // router.post("/register", registerSeller);
// // router.post("/login", loginSeller);
// // router.post("/forgot-password", forgotPassword);
// // router.post("/reset-password", resetPassword);

// // // ==================== PROTECTED ROUTES ====================
// // router.get("/profile", sellerAuth, getSellerProfile);
// // router.put("/profile", sellerAuth, updateSellerProfile);
// // router.put("/change-password", sellerAuth, changePassword);
// // router.post("/logout", sellerAuth, logoutSeller);

// // // ==================== HEALTH CHECK ====================
// // router.get("/health", (req, res) => {
// //   res.status(200).json({
// //     success: true,
// //     message: "Seller API is healthy",
// //     timestamp: new Date().toISOString(),
// //   });
// // });

// // module.exports = router;

// const express = require("express");
// const router = express.Router();

// const {
//   registerSeller,
//   loginSeller,
//   getSellerProfile,
//   updateSellerProfile,
//   changePassword,
//   logoutSeller,
//   forgotPassword,
//   resetPassword,

//   // Admin
//   getAllSellers,
//   approveSeller,
//   rejectSeller,
// } = require("../../controllers/seller/sellerController");
// const {
//   sellerAuth,
// } = require("../../middleware/seller/sellerAuth");

// // Public Routes
// router.post("/register", registerSeller);
// router.post("/login", loginSeller);
// router.post("/forgot-password", forgotPassword);
// router.post("/reset-password", resetPassword);

// // Protected Routes
// router.get("/profile", sellerAuth, getSellerProfile);
// router.put("/profile", sellerAuth, updateSellerProfile);
// router.put("/change-password", sellerAuth, changePassword);
// router.post("/logout", sellerAuth, logoutSeller);

// // Health
// router.get("/health", (req, res) => {
//   res.json({
//     success: true,
//     message: "Seller API Working",
//   });
// });

// module.exports = router;

const express = require("express");
const router = express.Router();

const {
  registerSeller,
  loginSeller,
  getSellerProfile,
  updateSellerProfile,
  changePassword,
  logoutSeller,
  forgotPassword,
  resetPassword,

  // Admin
  getAllSellers,
  getSellerDetails,
  approveSeller,
  rejectSeller,
} = require("../../controllers/seller/sellerController");

const {
  sellerAuth,
} = require("../../middleware/seller/sellerAuth");

// ==================== PUBLIC ====================

router.post("/register", registerSeller);
router.post("/login", loginSeller);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// ==================== SELLER ====================

router.get("/profile", sellerAuth, getSellerProfile);

router.put("/profile", sellerAuth, updateSellerProfile);

router.put("/change-password", sellerAuth, changePassword);

router.post("/logout", sellerAuth, logoutSeller);

// ==================== ADMIN SELLER MANAGEMENT ====================

router.get(
  "/admin/sellers",
  getAllSellers
);

router.put(
  "/admin/sellers/:id/approve",
  approveSeller
);

router.put(
  "/admin/sellers/:id/reject",
  rejectSeller
);

// ==================== HEALTH ====================

router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Seller API Working",
  });
});

module.exports = router;