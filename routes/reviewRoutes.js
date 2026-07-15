const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createReview,
  getReviews,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

// Test Route
router.get("/test", (req, res) => {
  res.json({ message: "Review Route Working" });
});

router.post("/", protect, createReview);

router.get("/product/:productId", getReviews);

router.put("/:id", protect, updateReview);

router.delete("/:id", protect, deleteReview);

module.exports = router;