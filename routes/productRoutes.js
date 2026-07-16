const express = require("express");

const router = express.Router();
const upload = require("../config/multer");

const {
  createProduct,
  getProducts,
  getProductById,
  getProductsByCategory,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");


router.post(
    "/",
    upload.single("image"),
    createProduct
);

router.get("/", getProducts); 
router.get("/category/:categoryId", getProductsByCategory);

router.get("/:id", getProductById);

router.put("/:id", updateProduct);

router.delete("/:id", deleteProduct);

module.exports = router;