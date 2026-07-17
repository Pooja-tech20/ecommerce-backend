const express = require("express");

const router = express.Router();

const protect = require("../middleware/protect");
const admin = require("../middleware/admin");

const {
    getSalesReport
} = require("../controllers/salesReportController");

router.get(
    "/",
    protect,
    admin,
    getSalesReport
);

module.exports = router;