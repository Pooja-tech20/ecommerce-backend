// const express = require("express");

// const router = express.Router();

// console.log("✅ invoiceRoutes.js LOADED");

// const protect = require("../middleware/authMiddleware");
// const adminOnly = require("../middleware/adminOnly");

// const {
//   generateInvoice,
//   getInvoice,
//   downloadInvoice,
//   downloadAllInvoices,
//   downloadFilteredInvoices,
//   getInvoiceByOrder,
//   getAllInvoices,
// } = require("../controllers/invoiceController");
// // ========================================
// // Generate Invoice
// // POST /api/invoices/generate/:orderId
// // ========================================
// router.post(
//   "/generate/:orderId",
//   protect,
//   adminOnly,
//   generateInvoice
// );

// // ========================================
// // Get Invoice JSON
// // GET /api/invoices/order/:orderId
// // ========================================
// router.get(
//   "/order/:orderId",
//   protect,
//   adminOnly,
//   getInvoiceByOrder
// );

// // Download filtered invoices as ONE PDF
// router.post(
//   "/download-filtered",
//   protect,
//   adminOnly,
//   downloadFilteredInvoices
// );


// // ========================================
// // Download All / Filtered Invoices
// // POST /api/invoices/download-all
// // ========================================
// router.post(
//   "/download-all",
//   protect,
//   adminOnly,
//   downloadAllInvoices
// );

// // ========================================
// // Download Single Invoice
// // GET /api/invoices/download/:orderId
// // ========================================
// router.get(
//   "/download/:orderId",
//   protect,
//   adminOnly,
//   downloadInvoice
// );

// // ========================================
// // Preview Invoice PDF
// // GET /api/invoices/:orderId
// // ========================================
// router.get(
//   "/:orderId",
//   protect,
//   adminOnly,
//   getInvoice
// );

// // ========================================
// // Get All Invoices
// // GET /api/invoices
// // ========================================
// router.get(
//   "/",
//   protect,
//   adminOnly,
//   getAllInvoices
// );

// module.exports = router;

const express = require("express");
const router = express.Router();

const {
  generateInvoice,
  getInvoice,
  downloadInvoice,
  downloadAllInvoices,
  downloadFilteredInvoices,
  getInvoiceByOrder,
  getAllInvoices,
  generateAllInvoices,
} = require("../controllers/invoiceController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// ========================================
// INVOICE ROUTES
// ========================================

// IMPORTANT: /all MUST come before /:orderId

router.get("/all", protect, adminOnly, getAllInvoices);

router.get("/order/:orderId", protect, adminOnly, getInvoiceByOrder);

router.get("/preview/:orderId", protect, adminOnly, getInvoice);

router.get("/download/:orderId", protect, adminOnly, downloadInvoice);

router.post(
  "/generate/:orderId",
  protect,
  adminOnly,
  generateInvoice
);

router.post(
  "/generate-all",
  protect,
  adminOnly,
  generateAllInvoices
);

router.post(
  "/download-filtered",
  protect,
  adminOnly,
  downloadFilteredInvoices
);

router.post(
  "/download-all",
  protect,
  adminOnly,
  downloadAllInvoices
);

module.exports = router;