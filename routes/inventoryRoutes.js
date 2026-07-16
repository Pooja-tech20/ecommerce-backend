const express = require("express");
const router = express.Router();

const protect = require("../middleware/protect");

// Change this if your admin middleware has a different filename
const admin = require("../middleware/admin");

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
router.get("/", protect, admin, getInventory);

// ============================
// Inventory Statistics
// GET /api/inventory/stats
// ============================
router.get("/stats", protect, admin, getInventoryStats);

// ============================
// Low Stock Products
// GET /api/inventory/low-stock
// ============================
router.get("/low-stock", protect, admin, getLowStockProducts);

// ============================
// Out of Stock Products
// GET /api/inventory/out-of-stock
// ============================
router.get("/out-of-stock", protect, admin, getOutOfStockProducts);

// ============================
// Update Product Stock
// PUT /api/inventory/:id/stock
// ============================
router.put("/:id/stock", protect, admin, updateStock);

module.exports = router;