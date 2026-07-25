const express = require("express");
const router = express.Router();

const upload = require("../config/multer");

const {
  createProduct,
  createMultipleProducts,
  getProducts,
  getProductById,
  getProductsByCategory,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// Bulk Insert
router.post("/bulk", createMultipleProducts);

// Create Product (Single Image)
router.post("/", upload.single("image"), createProduct);

// Get All Products
router.get("/", getProducts);

// Get Products By Category
router.get("/category/:categoryId", getProductsByCategory);

// Get Single Product
router.get("/:id", getProductById);

// Update Product (Single Image)
router.put("/:id", upload.single("image"), updateProduct);

// Delete Product
router.delete("/:id", deleteProduct);

module.exports = router;