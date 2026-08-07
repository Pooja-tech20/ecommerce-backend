const mongoose = require("mongoose");

const earningSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    commission: {
      type: Number,
      required: true,
    },
    netAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Available", "Withdrawn", "Failed"],
      default: "Pending",
    },
    type: {
      type: String,
      enum: ["Sale", "Refund", "Adjustment"],
      default: "Sale",
    },
    withdrawalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Withdrawal",
      default: null,
    },
    description: {
      type: String,
      default: "",
    },
    availableAt: {
      type: Date,
      default: () => new Date(+new Date() + 7 * 24 * 60 * 60 * 1000), // 7 days settlement
    },
  },
  { timestamps: true }
);

// Withdrawal Schema
const withdrawalSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    bankDetails: {
      accountNumber: String,
      ifscCode: String,
      accountHolder: String,
      bankName: String,
    },
    upiId: String,
    status: {
      type: String,
      enum: ["Pending", "Processing", "Completed", "Failed"],
      default: "Pending",
    },
    transactionId: {
      type: String,
      default: "",
    },
    notes: {
      type: String,
      default: "",
    },
    processedAt: Date,
  },
  { timestamps: true }
);

module.exports = {
  Earning: mongoose.model("Earning", earningSchema),
  Withdrawal: mongoose.model("Withdrawal", withdrawalSchema),
};