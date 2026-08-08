// // const express = require("express");
// // const router = express.Router();

// // const sellerAuth = require("../../middleware/seller/sellerAuth");
// // const inventoryController = require("../../controllers/seller/sellerInventoryController");

// // // ==================== PHASE 6: INVENTORY MANAGEMENT ====================

// // // 📦 Product CRUD
// // router.post("/", sellerAuth, inventoryController.addProduct);
// // router.get("/", sellerAuth, inventoryController.getProducts);
// // router.get("/stats", sellerAuth, inventoryController.getProductStats);
// // router.get("/:id", sellerAuth, inventoryController.getProduct);
// // router.put("/:id", sellerAuth, inventoryController.updateProduct);
// // router.delete("/:id", sellerAuth, inventoryController.deleteProduct);

// // // 📊 Stock Management
// // router.patch("/:id/stock", sellerAuth, inventoryController.updateStock);

// // // 📤 Bulk Operations
// // router.post("/bulk", sellerAuth, inventoryController.bulkUpload);

// // module.exports = router;

// const express = require("express");
// const router = express.Router();

// const sellerAuth = require("../../middleware/seller/sellerAuth");
// const inventoryController = require("../../controllers/seller/sellerInventoryController");

// // Product CRUD
// router.post("/", sellerAuth, inventoryController.addProduct);
// router.get("/", sellerAuth, inventoryController.getProducts);
// router.get("/stats", sellerAuth, inventoryController.getProductStats);
// router.get("/:id", sellerAuth, inventoryController.getProduct);
// router.put("/:id", sellerAuth, inventoryController.updateProduct);
// router.delete("/:id", sellerAuth, inventoryController.deleteProduct);

// // Stock
// router.patch("/:id/stock", sellerAuth, inventoryController.updateStock);

// // Bulk Upload
// router.post("/bulk", sellerAuth, inventoryController.bulkUpload);

// module.exports = router;

const express = require("express");
const router = express.Router();

const { sellerAuth } = require("../../middleware/seller/sellerAuth");
const inventoryController = require("../../controllers/seller/sellerInventoryController");

// ===== DEBUG =====
console.log("sellerAuth:", sellerAuth);

console.log("Inventory Controller:", inventoryController);

console.log({
  addProduct: inventoryController.addProduct,
  getProducts: inventoryController.getProducts,
  getProductStats: inventoryController.getProductStats,
  getProduct: inventoryController.getProduct,
  updateProduct: inventoryController.updateProduct,
  deleteProduct: inventoryController.deleteProduct,
  updateStock: inventoryController.updateStock,
  bulkUpload: inventoryController.bulkUpload,
});
// =================

// Product CRUD
router.post("/", sellerAuth, inventoryController.addProduct);
router.get("/", sellerAuth, inventoryController.getProducts);
router.get("/stats", sellerAuth, inventoryController.getProductStats);
router.get("/:id", sellerAuth, inventoryController.getProduct);
router.put("/:id", sellerAuth, inventoryController.updateProduct);
router.delete("/:id", sellerAuth, inventoryController.deleteProduct);

// Stock
router.patch("/:id/stock", sellerAuth, inventoryController.updateStock);

// Bulk Upload
router.post("/bulk", sellerAuth, inventoryController.bulkUpload);

module.exports = router;