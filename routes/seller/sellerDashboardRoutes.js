const express = require("express");

const router = express.Router();

const { sellerAuth } = require("../../middleware/seller/sellerAuth");

const {
  getDashboard,
} = require("../../controllers/seller/sellerDashboardController");

router.get("/", sellerAuth, getDashboard);

module.exports = router;