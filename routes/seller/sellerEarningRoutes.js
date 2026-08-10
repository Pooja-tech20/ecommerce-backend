const express = require("express");
const router = express.Router();

const { sellerAuth } = require("../../middleware/seller/sellerAuth");
const earningController = require("../../controllers/seller/sellerEarningController");

// ==================== PHASE 8: EARNINGS & WITHDRAWALS ====================

// 🧪 Test Earning
router.post(
  "/test",
  sellerAuth,
  earningController.createTestEarning
);

// 💰 Earnings
router.get("/", sellerAuth, earningController.getEarnings);
router.get("/summary", sellerAuth, earningController.getEarningsSummary);

// 💵 Withdrawals
router.post("/withdraw", sellerAuth, earningController.withdrawEarnings);
router.get("/withdrawals", sellerAuth, earningController.getWithdrawals);

// 💳 Bank Details
router.put("/bank-details", sellerAuth, earningController.addBankDetails);
router.get("/bank-details", sellerAuth, earningController.getBankDetails);

module.exports = router;