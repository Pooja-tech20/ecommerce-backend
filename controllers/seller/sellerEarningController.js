const { Earning, Withdrawal } = require("../../models/seller/Earning");
const Seller = require("../../models/seller/Seller");
const mongoose = require("mongoose");

// ==========================================================
// CREATE TEST EARNING (For Testing)
// POST /api/seller/earnings/test
// ==========================================================
exports.createTestEarning = async (req, res) => {
  try {
    const sellerId = req.seller._id;

    const earning = await Earning.create({
      sellerId,
      orderId: new mongoose.Types.ObjectId(),
      grossAmount: 1000,
      commission: 100,
      netAmount: 900,
      status: "Available",
      type: "Sale",
      description: "Test earning for testing",
    });

    res.status(201).json({
      success: true,
      message: "Test earning created",
      data: earning,
    });
  } catch (error) {
    console.error("Create test earning error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================================
// GET EARNINGS SUMMARY
// GET /api/seller/earnings/summary
// ==========================================================
exports.getEarningsSummary = async (req, res) => {
  try {
    const sellerId = req.seller._id;

    // Summary by status
    const summary = await Earning.aggregate([
      { $match: { sellerId: sellerId } },
      {
        $group: {
          _id: "$status",
          total: { $sum: "$netAmount" },
          count: { $sum: 1 },
        },
      },
    ]);

    // Total earnings
    const totalEarnings = await Earning.aggregate([
      { $match: { sellerId: sellerId } },
      {
        $group: {
          _id: null,
          total: { $sum: "$netAmount" },
          pending: {
            $sum: { $cond: [{ $eq: ["$status", "Pending"] }, "$netAmount", 0] },
          },
          available: {
            $sum: { $cond: [{ $eq: ["$status", "Available"] }, "$netAmount", 0] },
          },
          withdrawn: {
            $sum: { $cond: [{ $eq: ["$status", "Withdrawn"] }, "$netAmount", 0] },
          },
        },
      },
    ]);

    // Monthly earnings (last 12 months)
    const monthlyEarnings = await Earning.aggregate([
      { $match: { sellerId: sellerId, status: { $in: ["Available", "Withdrawn"] } } },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          total: { $sum: "$netAmount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 12 },
    ]);

    res.status(200).json({
      success: true,
      data: {
        summary: totalEarnings[0] || { total: 0, pending: 0, available: 0, withdrawn: 0 },
        byStatus: summary,
        monthly: monthlyEarnings,
      },
    });
  } catch (error) {
    console.error("Get earnings summary error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================================
// GET EARNINGS LIST
// GET /api/seller/earnings
// ==========================================================
exports.getEarnings = async (req, res) => {
  try {
    const sellerId = req.seller._id;
    const { page = 1, limit = 10, status, type } = req.query;

    const query = { sellerId };
    if (status) query.status = status;
    if (type) query.type = type;

    const earnings = await Earning.find(query)
      .populate("orderId", "orderId totalAmount")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Earning.countDocuments(query);

    res.status(200).json({
      success: true,
      data: earnings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get earnings error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================================
// WITHDRAW EARNINGS
// POST /api/seller/earnings/withdraw
// ==========================================================
exports.withdrawEarnings = async (req, res) => {
  try {
    const sellerId = req.seller._id;
    const { amount, bankDetails, upiId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid withdrawal amount",
      });
    }

    // Check available balance
    const available = await Earning.aggregate([
      { $match: { sellerId: sellerId, status: "Available" } },
      { $group: { _id: null, total: { $sum: "$netAmount" } } },
    ]);

    const balance = available[0]?.total || 0;

    if (amount > balance) {
      return res.status(400).json({
        success: false,
        message: `Insufficient balance. Available: ₹${balance}`,
      });
    }

    // Create withdrawal request
    const withdrawal = new Withdrawal({
      sellerId,
      amount,
      bankDetails: bankDetails || {},
      upiId: upiId || "",
      status: "Pending",
    });

    await withdrawal.save();

    // Update earnings status
    let remainingAmount = amount;
    const availableEarnings = await Earning.find({
      sellerId: sellerId,
      status: "Available",
    }).sort({ createdAt: 1 });

    for (const earning of availableEarnings) {
      if (remainingAmount <= 0) break;
      
      const deductAmount = Math.min(earning.netAmount, remainingAmount);
      earning.status = "Withdrawn";
      earning.withdrawalId = withdrawal._id;
      await earning.save();
      
      remainingAmount -= deductAmount;
    }

    res.status(201).json({
      success: true,
      message: "Withdrawal request submitted successfully",
      data: withdrawal,
    });
  } catch (error) {
    console.error("Withdraw earnings error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================================
// GET WITHDRAWAL HISTORY
// GET /api/seller/earnings/withdrawals
// ==========================================================
exports.getWithdrawals = async (req, res) => {
  try {
    const sellerId = req.seller._id;
    const { page = 1, limit = 10, status } = req.query;

    const query = { sellerId };
    if (status) query.status = status;

    const withdrawals = await Withdrawal.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Withdrawal.countDocuments(query);

    res.status(200).json({
      success: true,
      data: withdrawals,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get withdrawals error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================================
// ADD BANK DETAILS
// PUT /api/seller/earnings/bank-details
// ==========================================================
exports.addBankDetails = async (req, res) => {
  try {
    const sellerId = req.seller._id;
    const { accountNumber, ifscCode, accountHolder, bankName, upiId } = req.body;

    const seller = await Seller.findById(sellerId);
    
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    seller.bankDetails = {
      accountNumber: accountNumber || seller.bankDetails?.accountNumber || "",
      ifscCode: ifscCode || seller.bankDetails?.ifscCode || "",
      accountHolder: accountHolder || seller.bankDetails?.accountHolder || "",
      bankName: bankName || seller.bankDetails?.bankName || "",
    };
    
    if (upiId) seller.upiId = upiId;
    
    await seller.save();

    res.status(200).json({
      success: true,
      message: "Bank details updated successfully",
      data: {
        bankDetails: seller.bankDetails,
        upiId: seller.upiId,
      },
    });
  } catch (error) {
    console.error("Add bank details error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================================
// GET BANK DETAILS
// GET /api/seller/earnings/bank-details
// ==========================================================
exports.getBankDetails = async (req, res) => {
  try {
    const sellerId = req.seller._id;

    const seller = await Seller.findById(sellerId).select("bankDetails upiId");
    
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        bankDetails: seller.bankDetails || {},
        upiId: seller.upiId || "",
      },
    });
  } catch (error) {
    console.error("Get bank details error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};