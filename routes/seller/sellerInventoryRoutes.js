const express = require("express");
const router = express.Router();
const authSeller = require("../../middleware/authSeller");
const inventoryController = require("../../controllers/seller/inventoryController");

// ==================== PHASE 6: INVENTORY MANAGEMENT ====================

// 📦 Product CRUD
router.post("/", authSeller, inventoryController.addProduct);
router.get("/", authSeller, inventoryController.getProducts);
router.get("/stats", authSeller, inventoryController.getProductStats);
router.get("/:id", authSeller, inventoryController.getProduct);
router.put("/:id", authSeller, inventoryController.updateProduct);
router.delete("/:id", authSeller, inventoryController.deleteProduct);

// 📊 Stock Management
router.patch("/:id/stock", authSeller, inventoryController.updateStock);

// 📤 Bulk Operations
router.post("/bulk", authSeller, inventoryController.bulkUpload);

module.exports = router;