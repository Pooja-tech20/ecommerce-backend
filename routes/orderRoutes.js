const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  trackOrder,
} = require("../controllers/orderController");

// ================= User Routes =================

// Create Order
router.post("/", protect, createOrder);

// Get Logged In User Orders
router.get("/my-orders", protect, getMyOrders);

// Get Single Order
router.get("/:id", protect, getOrderById);

// Cancel Order
router.put("/cancel/:id", protect, cancelOrder);

// ================= Admin Routes =================

// Get All Orders
router.get("/", protect, getAllOrders);

// Update Order Status
router.put("/:id", protect, updateOrderStatus);

router.patch("/:id/status", protect, updateOrderStatus);

router.get("/track/:id", protect, trackOrder);

module.exports = router;