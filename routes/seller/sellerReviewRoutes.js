const express = require("express");
const router = express.Router();

// ✅ Import sellerAuth correctly
const { sellerAuth } = require("../../middleware/seller/sellerAuth");

const reviewController = require("../../controllers/seller/sellerReviewController");

// ==================== PHASE 9: REVIEW MANAGEMENT ====================

// ⭐ Get all reviews (with filters & pagination)
router.get("/", sellerAuth, reviewController.getReviews);

// 📊 Get review stats
router.get("/stats", sellerAuth, reviewController.getReviewStats);

// 🔍 Get single review
router.get("/:id", sellerAuth, reviewController.getReview);

// 📝 Get product review summary
router.get("/product/:productId/summary", sellerAuth, reviewController.getProductReviewSummary);

// 💬 Reply to review
router.post("/:id/reply", sellerAuth, reviewController.replyToReview);

// 👍 Mark review as helpful
router.post("/:id/helpful", sellerAuth, reviewController.markHelpful);

// 🚫 Update review status (approve/hide/report)
router.patch("/:id/status", sellerAuth, reviewController.updateReviewStatus);

// 🗑️ Delete review
router.delete("/:id", sellerAuth, reviewController.deleteReview);

module.exports = router;