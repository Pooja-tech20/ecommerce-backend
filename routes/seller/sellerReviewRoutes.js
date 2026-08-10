const express = require("express");
const router = express.Router();

const {
  addSellerReview,
  getSellerReviews,
  getAllSellerReviews,
  updateReviewStatus,
  deleteSellerReview,
  replyToReview,
} = require("../../controllers/seller/sellerReviewController");

const protect = require("../../middleware/authMiddleware");
const adminOnly = require("../../middleware/adminOnly");
const { sellerAuth } = require("../../middleware/seller/sellerAuth");

// Customer
router.post("/", protect, addSellerReview);

// Public
router.get("/seller/:sellerId", getSellerReviews);

// Admin
router.get("/admin/all", protect, adminOnly, getAllSellerReviews);
router.put("/admin/:id/status", protect, adminOnly, updateReviewStatus);
router.delete("/admin/:id", protect, adminOnly, deleteSellerReview);

// Seller
router.put("/:id/reply", sellerAuth, replyToReview);

module.exports = router;