const express = require("express");

const router = express.Router();

const {
  getSettings,
  getPublicSettings,
  updateSettings,
} = require("../controllers/settingsController");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminOnly");

// Public — no auth required. Must come before "/" so it isn't shadowed.
router.get("/public", getPublicSettings);

router.get("/", protect, adminOnly, getSettings);

router.put("/", protect, adminOnly, updateSettings);

module.exports = router;