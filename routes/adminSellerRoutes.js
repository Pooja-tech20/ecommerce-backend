const express = require("express");

const router = express.Router();

const {
  getPendingSellers,
  approveSeller,
  rejectSeller,
} = require("../controllers/adminSellerController");

// Add your existing admin authentication middleware here
// Example:
// const { protect, adminOnly } = require("../middleware/auth");

router.get(
  "/sellers/pending",
  // protect,
  // adminOnly,
  getPendingSellers
);

router.put(
  "/sellers/:id/approve",
  // protect,
  // adminOnly,
  approveSeller
);

router.put(
  "/sellers/:id/reject",
  // protect,
  // adminOnly,
  rejectSeller
);

module.exports = router;