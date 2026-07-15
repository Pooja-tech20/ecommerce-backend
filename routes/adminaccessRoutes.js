const express = require("express");

const router = express.Router();

const protect = require("../middleware/protect");

const { dashboard } = require("../controllers/adminaccessController");

// Dashboard

router.get("/dashboard", protect, dashboard);

module.exports = router;