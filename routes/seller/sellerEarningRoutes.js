const express = require("express");
const router = express.Router();
const authSeller = require("../../middleware/authSeller");
const earningController = require("../../controllers/seller/earningController");

// ==================== PHASE 8: EARNINGS & WITHDRAWALS ====================

// 💰 Earnings
router.get("/", authSeller, earningController.getEarnings);
router.get("/summary", authSeller, earningController.getEarningsSummary);

// 💵 Withdrawals
router.post("/withdraw", authSeller, earningController.withdrawEarnings);
router.get("/withdrawals", authSeller, earningController.getWithdrawals);

// 💳 Bank Details
router.put("/bank-details", authSeller, earningController.addBankDetails);

module.exports = router;