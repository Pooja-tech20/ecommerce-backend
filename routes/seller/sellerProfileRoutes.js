const express = require("express");
const router = express.Router();
const authSeller = require("../../middleware/authSeller");
const profileController = require("../../controllers/seller/profileController");

// ==================== PHASE 10: PROFILE & SETTINGS ====================

// 👤 Profile Management
router.get("/", authSeller, profileController.getProfile);
router.put("/", authSeller, profileController.updateProfile);
router.post("/change-password", authSeller, profileController.changePassword);
router.delete("/", authSeller, profileController.deleteAccount);

// 🏪 Shop Settings
router.put("/shop", authSeller, profileController.updateShopSettings);
router.post("/logo", authSeller, profileController.uploadLogo);

// 💳 Payment Settings
router.put("/payment", authSeller, profileController.updatePaymentSettings);

// 🔔 Notification Settings
router.put("/notifications", authSeller, profileController.updateNotificationSettings);

// 📊 Dashboard & Analytics
router.get("/dashboard", authSeller, profileController.getDashboardStats);
router.get("/analytics", authSeller, profileController.getAnalytics);

module.exports = router;