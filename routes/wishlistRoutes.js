const express = require("express");

const router = express.Router();

const protect = require("../middleware/protect");

const {
  addToWishlist,
  getWishlist,
  removeWishlistItem,
  clearWishlist,
} = require("../controllers/wishlistController");

router.post("/add", protect, addToWishlist);

router.get("/", protect, getWishlist);

router.delete("/remove/:productId", protect, removeWishlistItem);

router.delete("/clear", protect, clearWishlist);

module.exports = router;