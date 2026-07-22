const express = require("express");
const router = express.Router();

const protect = require("../middleware/protect");

// Change this if your admin middleware has a different filename
const adminOnly = require("../middleware/adminOnly");

const {
  getInventory,
  getInventoryStats,
  updateStock,
  getLowStockProducts,
  getOutOfStockProducts,
} = require("../controllers/inventoryController");

// ============================
// Inventory List
// GET /api/inventory
// ============================
router.get("/", protect, adminOnly, getInventory);

// ============================
// Inventory Statistics
// GET /api/inventory/stats
// ============================
router.get("/stats", protect, adminOnly, getInventoryStats);

// ============================
// Low Stock Products
// GET /api/inventory/low-stock
// ============================
router.get("/low-stock", protect, adminOnly, getLowStockProducts);

// ============================
// Out of Stock Products
// GET /api/inventory/out-of-stock
// ============================
router.get("/out-of-stock", protect, adminOnly, getOutOfStockProducts);

// ============================
// Update Product Stock
// PUT /api/inventory/:id/stock
// ============================
router.put("/:id/stock", protect, adminOnly, updateStock);

module.exports = router;