// const express = require("express");
// const router = express.Router();

// const protect = require("../middleware/authMiddleware");
// const adminOnly = require("../middleware/adminOnly");

// const {
//   generateInvoice,
//   getInvoice,
// } = require("../controllers/invoiceController");


// // ========================================
// // Generate Invoice
// // ========================================
// router.post(
//   "/generate/:orderId",
//   protect,
//   adminOnly,
//   generateInvoice
// );


// // ========================================
// // Get Invoice
// // ========================================
// router.get(
//   "/:orderId",
//   protect,
//   adminOnly,
//   getInvoice
// );


// module.exports = router;
const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminOnly");

const {
  generateInvoice,
  getInvoice,
  downloadInvoice,
  getInvoiceByOrder,
  getAllInvoices,
} = require("../controllers/invoiceController");

// Generate invoice
router.post(
  "/generate/:orderId",
  protect,
  adminOnly,
  generateInvoice
);

// Get invoice JSON data
router.get(
  "/order/:orderId",
  protect,
  adminOnly,
  getInvoiceByOrder
);

// Download invoice PDF
router.get(
  "/download/:orderId",
  protect,
  adminOnly,
  downloadInvoice
);

// Preview invoice PDF
router.get(
  "/:orderId",
  protect,
  adminOnly,
  getInvoice
);

// Get all invoices
router.get(
  "/",
  protect,
  adminOnly,
  getAllInvoices
);

module.exports = router;