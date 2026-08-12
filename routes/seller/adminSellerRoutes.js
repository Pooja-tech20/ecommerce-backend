// const express = require("express");

// const router = express.Router();

// const {
//   getPendingSellers,
//   approveSeller,
//   rejectSeller,
// } = require("../../controllers/seller/adminSellerController");

// // Add your existing admin authentication middleware here
// // Example:
// // const { protect, adminOnly } = require("../middleware/auth");

// router.get(
//   "/sellers/pending",
//   // protect,
//   // adminOnly,
//   getPendingSellers
// );

// router.put(
//   "/sellers/:id/approve",
//   // protect,
//   // adminOnly,
//   approveSeller
// );

// router.put(
//   "/sellers/:id/reject",
//   // protect,
//   // adminOnly,
//   rejectSeller
// );

// module.exports = router;

const express = require("express");

const router = express.Router();

const {
  // Existing approval APIs
  getPendingSellers,
  approveSeller,
  rejectSeller,

  // CRUD APIs
  getAllSellers,
  getSellerById,
  createSeller,
  updateSeller,
  deleteSeller,
} = require("../../controllers/seller/adminSellerController");


// =====================================================
// SELLER MANAGEMENT - ADMIN
// =====================================================

// GET all sellers
// GET /api/admin/sellers
router.get(
  "/sellers",
  // protect,
  // adminOnly,
  getAllSellers
);


// GET pending sellers
// GET /api/admin/sellers/pending
router.get(
  "/sellers/pending",
  // protect,
  // adminOnly,
  getPendingSellers
);


// GET single seller
// GET /api/admin/sellers/:id
router.get(
  "/sellers/:id",
  // protect,
  // adminOnly,
  getSellerById
);


// CREATE seller
// POST /api/admin/sellers
router.post(
  "/sellers",
  // protect,
  // adminOnly,
  createSeller
);


// UPDATE seller
// PUT /api/admin/sellers/:id
router.put(
  "/sellers/:id",
  // protect,
  // adminOnly,
  updateSeller
);


// APPROVE seller
// PUT /api/admin/sellers/:id/approve
router.put(
  "/sellers/:id/approve",
  // protect,
  // adminOnly,
  approveSeller
);


// REJECT seller
// PUT /api/admin/sellers/:id/reject
router.put(
  "/sellers/:id/reject",
  // protect,
  // adminOnly,
  rejectSeller
);


// DELETE seller
// DELETE /api/admin/sellers/:id
router.delete(
  "/sellers/:id",
  // protect,
  // adminOnly,
  deleteSeller
);


module.exports = router;