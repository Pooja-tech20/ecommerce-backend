const express = require("express");

const router = express.Router();

const protect = require("../middleware/protect");
const adminOnly = require("../middleware/adminOnly");

const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleUserStatus,
  changeUserPassword,
} = require("../controllers/adminUserController");

const { getUserDetails } = require("../controllers/adminUserDetailsController");


// ================================
// Admin User Management Routes
// ================================

router.put("/:id/change-password", protect, adminOnly, changeUserPassword);

router.delete("/:id", protect, adminOnly, deleteUser);

// Get all users
// GET /api/admin/users
router.get(
  "/",
  protect,
  adminOnly,
  getAllUsers
);


// Get full user details
// Address + Orders + Products History
// GET /api/admin/users/:id/details
router.get(
  "/:id/details",
  protect,
  adminOnly,
  getUserDetails
);


// Get single user
// GET /api/admin/users/:id
router.get(
  "/:id",
  protect,
  adminOnly,
  getUserById
);


// Update user
// PUT /api/admin/users/:id
router.put(
  "/:id",
  protect,
  adminOnly,
  updateUser
);


// Delete user
// DELETE /api/admin/users/:id
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteUser
);


// Activate / Deactivate user
// PATCH /api/admin/users/status/:id
router.patch(
  "/status/:id",
  protect,
  adminOnly,
  toggleUserStatus
);


module.exports = router;