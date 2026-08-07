const express = require("express");
const router = express.Router();
const authSeller = require("../../middleware/authSeller");
const reviewController = require("../../controllers/seller/reviewController");

// ==================== PHASE 9: REVIEW MANAGEMENT ====================

// ⭐ Reviews List & Stats
router.get("/", authSeller, reviewController.getReviews);
router.get("/stats", authSeller, reviewController.getReviewStats);

// 💬 Review Actions
router.post("/:id/reply", authSeller, reviewController.replyToReview);
router.patch("/:id/status", authSeller, reviewController.updateReviewStatus);

module.exports = router;