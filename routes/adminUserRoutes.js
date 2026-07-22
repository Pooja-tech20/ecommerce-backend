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

router.get("/", protect, adminOnly, getAllUsers);

router.get("/:id", protect, adminOnly, getUserById);

router.put("/:id", protect, adminOnly, updateUser);

router.put("/:id/change-password", protect, adminOnly, changeUserPassword);

router.delete("/:id", protect, adminOnly, deleteUser);

router.patch("/status/:id", protect, adminOnly, toggleUserStatus);

module.exports = router;