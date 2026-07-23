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

// Create Product (Multiple Images)
router.post("/", upload.array("images", 5), createProduct);

// Get All Products
router.get("/", getProducts);

// Get Products By Category
router.get("/category/:categoryId", getProductsByCategory);

// Get Single Product
router.get("/:id", getProductById);

// Update Product
router.put("/:id", upload.array("images", 5), updateProduct);

// Delete Product
router.delete("/:id", deleteProduct);

module.exports = router;