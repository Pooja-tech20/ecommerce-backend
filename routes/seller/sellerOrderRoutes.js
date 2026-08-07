const express = require("express");
const router = express.Router();
const authSeller = require("../../middleware/authSeller");
const orderController = require("../../controllers/seller/orderController");

// ==================== PHASE 7: ORDER MANAGEMENT ====================

// 📋 Order List & Stats
router.get("/", authSeller, orderController.getOrders);
router.get("/stats", authSeller, orderController.getOrderStats);

// 🔍 Single Order
router.get("/:id", authSeller, orderController.getOrder);

// 📦 Order Status Updates
router.patch("/:id/status", authSeller, orderController.updateOrderStatus);

// 🚚 Tracking Updates
router.patch("/:id/tracking", authSeller, orderController.updateTracking);

module.exports = router;