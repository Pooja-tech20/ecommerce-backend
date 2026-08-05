// const express = require("express");
// const router = express.Router();

// const protect = require("../middleware/authMiddleware");

// const {
//   createReview,
//   getReviews,
//   updateReview,
//   deleteReview,
// } = require("../controllers/reviewController");

// // Test Route
// router.get("/test", (req, res) => {
//   res.json({ message: "Review Route Working" });
// });

// router.post("/", protect, createReview);

// router.get("/product/:productId", getReviews);

// router.put("/:id", protect, updateReview);

// router.delete("/:id", protect, deleteReview);

// module.exports = router;

const express = require("express");
const router = express.Router();
const protect = require("../middleware/protect");
const adminOnly = require("../middleware/adminOnly");

const {
  createReview,
  getReviews,
  updateReview,
  deleteReview,
  getAllReviews,
  getReviewStats,
  toggleReviewStatus,
  reportReview,
  getProductRatingSummary,
} = require("../controllers/reviewController");

// ==========================================================
// Public Routes
// ==========================================================
// Get reviews for a product
router.get("/product/:productId", getReviews);

// Get product rating summary
router.get("/product/:productId/rating-summary", getProductRatingSummary);

// ==========================================================
// Protected Routes (User/Admin)
// ==========================================================
// Create a review
router.post("/", protect, createReview);

// Update a review
router.put("/:id", protect, updateReview);

// Delete a review
router.delete("/:id", protect, deleteReview);

// Report a review
router.post("/:id/report", protect, reportReview);

// ==========================================================
// Admin Routes
// ==========================================================
// Get all reviews (admin)
router.get("/admin/all", protect, adminOnly, getAllReviews);

// Get review statistics (admin)
router.get("/admin/stats", protect, adminOnly, getReviewStats);

// Toggle review status (admin)
router.put("/admin/:id/toggle-status", protect, adminOnly, toggleReviewStatus);

module.exports = router;