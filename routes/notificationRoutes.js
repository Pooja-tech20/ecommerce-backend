const express = require("express");

const router = express.Router();

const protect = require("../middleware/protect");

const {
  createNotification,
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} = require("../controllers/notificationcontroller");

router.post("/", protect, createNotification);

router.get("/", protect, getNotifications);

router.put("/read-all", protect, markAllAsRead);

router.put("/:id", protect, markAsRead);

router.delete("/:id", protect, deleteNotification);

module.exports = router;