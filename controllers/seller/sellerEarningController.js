const { Earning, Withdrawal } = require("../../models/Earning");
const Seller = require("../../models/Seller");
const mongoose = require("mongoose");

// 💰 Get Earnings Summary
exports.getEarningsSummary = async (req, res) => {
  try {
    const sellerId = req.seller._id;

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

    // Monthly earnings
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
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 📋 Get Earnings List
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
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 💵 Withdraw Earnings
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
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 📋 Get Withdrawal History
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
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 💳 Add Bank Details
exports.addBankDetails = async (req, res) => {
  try {
    const sellerId = req.seller._id;
    const { accountNumber, ifscCode, accountHolder, bankName, upiId } = req.body;

    const seller = await Seller.findById(sellerId);
    seller.bankDetails = {
      accountNumber,
      ifscCode,
      accountHolder,
      bankName,
      upiId,
    };
    await seller.save();

    res.status(200).json({
      success: true,
      message: "Bank details updated successfully",
      data: seller.bankDetails,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};