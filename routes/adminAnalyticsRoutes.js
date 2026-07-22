const express = require("express");

const router = express.Router();

const protect = require("../middleware/protect");
const adminOnly = require("../middleware/adminOnly");

const {
  getAnalytics,
} = require("../controllers/adminAnalyticsController");

router.get("/", protect, adminOnly, getAnalytics);

module.exports = router;