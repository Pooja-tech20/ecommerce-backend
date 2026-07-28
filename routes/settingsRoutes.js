const express = require("express");

const router = express.Router();

const protect = require("../middleware/protect");
const adminOnly = require("../middleware/adminOnly");

const {
  getSettings,
  updateSettings,
  runBackupNow,
} = require("../controllers/settingsController");

// GET /api/admin/settings
router.get("/", protect, adminOnly, getSettings);

// PUT /api/admin/settings
router.put("/", protect, adminOnly, updateSettings);

// POST /api/admin/settings/backup/run
router.post("/backup/run", protect, adminOnly, runBackupNow);

module.exports = router;