const express = require("express");
const router = express.Router();

const {sellerAuth} = require("../../middleware/seller/sellerAuth");
const orderController = require("../../controllers/seller/sellerOrderController");

// ==================== PHASE 7: ORDER MANAGEMENT ====================

// 📋 Order List & Stats
router.get("/", sellerAuth, orderController.getOrders);
router.get("/stats", sellerAuth, orderController.getOrderStats);

// 🔍 Single Order
router.get("/:id", sellerAuth, orderController.getOrder);

// 📦 Order Status Updates
router.patch("/:id/status", sellerAuth, orderController.updateOrderStatus);

// 🚚 Tracking Updates
router.patch("/:id/tracking", sellerAuth, orderController.updateTracking);

module.exports = router;