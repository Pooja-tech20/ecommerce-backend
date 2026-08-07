const express = require("express");
const router = express.Router();

// Middleware
const protect = require("../middleware/protect");
const adminOnly = require("../middleware/adminOnly");

// Controllers
const {
  getSettings,
  updateSettings,
  runBackupNow,
  getPublicSettings,   // <-- added from your commented code
} = require("../controllers/settingsController");

// ─── Public routes (no auth) ───────────────────────────────────────────
// Must come before the "/" route so it isn't shadowed.
router.get("/public", getPublicSettings);

// ─── Admin routes ──────────────────────────────────────────────────────
router.get("/", protect, adminOnly, getSettings);
router.put("/", protect, adminOnly, updateSettings);
router.post("/backup/run", protect, adminOnly, runBackupNow);

module.exports = router;