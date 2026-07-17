const express = require("express");
const router = express.Router();

const protect = require("../middleware/protect");
const adminOnly = require("../middleware/adminOnly");

const {
  dashboard,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  blockUser,
  salesReport,
} = require("../controllers/adminaccessController");

// Protect all admin routes
router.use(protect);
router.use(adminOnly);

// Dashboard
router.get("/dashboard", dashboard);

// ======================
// User Management
// ======================
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
router.put("/users/block/:id", blockUser);

// ======================
// Sales Report
// ======================
router.get("/sales-report", salesReport);

module.exports = router;