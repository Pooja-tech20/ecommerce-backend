const express = require("express");

const router = express.Router();

const protect = require("../middleware/protect");

const {
  addToCart,
  getCart,
  updateCart,
  removeCartItem,
  clearCart,
} = require("../controllers/cartController");

router.post("/add", protect, addToCart);

router.get("/", protect, getCart);

router.put("/update/:productId", protect, updateCart);

router.delete("/remove/:productId", protect, removeCartItem);

router.delete("/clear", protect, clearCart);

module.exports = router;