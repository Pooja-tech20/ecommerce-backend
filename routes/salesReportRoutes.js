// // const express = require("express");

// // const router = express.Router();

// // const protect = require("../middleware/protect");
// // const adminOnly = require("../middleware/adminOnly");

// // const {
// //     getSalesReport
// // } = require("../controllers/salesReportController");

// // router.get(
// //     "/",
// //     protect,
// //     adminOnly,
// //     getSalesReport
// // );

// // module.exports = router;

// const express = require("express");

// const router = express.Router();

// const protect = require("../middleware/protect");
// const adminOnly = require("../middleware/adminOnly");

// const {
//     getSalesReport,
//     getDetailedReport,
// } = require("../controllers/salesReportController");

// router.get(
//     "/",
//     protect,
//     adminOnly,
//     getSalesReport
// );

// router.get(
//     "/table",
//     protect,
//     adminOnly,
//     getDetailedReport
// );

// module.exports = router;

const express = require("express");
const router = express.Router();
const protect = require("../middleware/protect");
const adminOnly = require("../middleware/adminOnly");

const {
    getSalesReport,
    getDetailedReport,
    exportToExcel,
    exportToPDF
} = require("../controllers/salesReportController");

// Basic sales report (your existing endpoint)
router.get(
    "/",
    protect,
    adminOnly,
    getSalesReport
);

// Detailed report with filters (your existing table endpoint)
router.get(
    "/table",
    protect,
    adminOnly,
    getDetailedReport
);

// Export endpoints
router.post(
    "/export/excel",
    protect,
    adminOnly,
    exportToExcel
);

router.post(
    "/export/pdf",
    protect,
    adminOnly,
    exportToPDF
);

module.exports = router;