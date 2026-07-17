const express = require("express");
const router = express.Router();

const protect = require("../middleware/protect");

const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  trackOrder,
} = require("../controllers/orderController");

// ==========================
// User Routes
// ==========================

// Place Order
router.post("/", protect, createOrder);

// Logged-in User Orders
router.get("/my-orders", protect, getMyOrders);

// Track Order
router.get("/track/:id", protect, trackOrder);

// Single Order Details
router.get("/:id", protect, getOrderById);

// Cancel Order
router.put("/cancel/:id", protect, cancelOrder);

// ==========================
// Admin Routes
// ==========================

// Get All Orders
router.get("/", protect, getAllOrders);

// Update Order Status
router.put("/:id", protect, updateOrderStatus);

module.exports = router;