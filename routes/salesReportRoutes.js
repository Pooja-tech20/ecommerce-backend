const express = require("express");

const router = express.Router();

const protect = require("../middleware/protect");
const adminOnly = require("../middleware/adminOnly");

const {
    getSalesReport
} = require("../controllers/salesReportController");

router.get(
    "/",
    protect,
    adminOnly,
    getSalesReport
);

module.exports = router;