// const express = require("express");
// const router = express.Router();

// const sellerAuth = require("../../middleware/seller/sellerAuth");
// const profileController = require("../../controllers/seller/sellerProfileController");

// // ==================== PHASE 10: PROFILE & SETTINGS ====================

// // 👤 Profile Management
// router.get("/", sellerAuth, profileController.getProfile);
// router.put("/", sellerAuth, profileController.updateProfile);
// router.post("/change-password", sellerAuth, profileController.changePassword);
// router.delete("/", sellerAuth, profileController.deleteAccount);

// // 🏪 Shop Settings
// router.put("/shop", sellerAuth, profileController.updateShopSettings);
// router.post("/logo", sellerAuth, profileController.uploadLogo);

// // 💳 Payment Settings
// router.put("/payment", sellerAuth, profileController.updatePaymentSettings);

// // 🔔 Notification Settings
// router.put("/notifications", sellerAuth, profileController.updateNotificationSettings);

// // 📊 Dashboard & Analytics
// router.get("/dashboard", sellerAuth, profileController.getDashboardStats);
// router.get("/analytics", sellerAuth, profileController.getAnalytics);

// module.exports = router;
const express = require("express");
const router = express.Router();

// ✅ FIX: Import sellerAuth correctly
const { sellerAuth } = require("../../middleware/seller/sellerAuth");

const profileController = require("../../controllers/seller/sellerProfileController");

// ==================== PROFILE MANAGEMENT ====================
router.get("/", sellerAuth, profileController.getProfile);
router.put("/", sellerAuth, profileController.updateProfile);
router.post("/change-password", sellerAuth, profileController.changePassword);
router.delete("/", sellerAuth, profileController.deleteAccount);

// ==================== SHOP SETTINGS ====================
router.put("/shop", sellerAuth, profileController.updateShopSettings);
router.post("/logo", sellerAuth, profileController.uploadLogo);

// ==================== PAYMENT SETTINGS ====================
router.put("/payment", sellerAuth, profileController.updatePaymentSettings);

// ==================== NOTIFICATION SETTINGS ====================
router.put("/notifications", sellerAuth, profileController.updateNotificationSettings);

// ==================== DASHBOARD & ANALYTICS ====================
router.get("/dashboard", sellerAuth, profileController.getDashboardStats);
router.get("/analytics", sellerAuth, profileController.getAnalytics);

module.exports = router;