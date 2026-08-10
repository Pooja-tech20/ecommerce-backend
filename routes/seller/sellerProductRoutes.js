const express = require("express");
const router = express.Router();
const { sellerAuth } = require("../../middleware/seller/sellerAuth");

const {
  addProduct,
  getSellerProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} = require("../../controllers/seller/sellerProductController");

router.post("/", sellerAuth, addProduct);

router.get("/", sellerAuth, getSellerProducts);

router.get("/:id", sellerAuth, getSingleProduct);

router.put("/:id", sellerAuth, updateProduct);

router.delete("/:id", sellerAuth, deleteProduct);

module.exports = router;