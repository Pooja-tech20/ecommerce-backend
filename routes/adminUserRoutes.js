const express = require("express");

const router = express.Router();

const protect = require("../middleware/protect");
const admin = require("../middleware/admin");

const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleUserStatus,
} = require("../controllers/adminUserController");

router.get("/", protect, admin, getAllUsers);

router.get("/:id", protect, admin, getUserById);

router.put("/:id", protect, admin, updateUser);

router.delete("/:id", protect, admin, deleteUser);

router.patch("/status/:id", protect, admin, toggleUserStatus);

module.exports = router;