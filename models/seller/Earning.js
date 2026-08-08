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
    orderItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderItem",
      default: null,
    },
    grossAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    commission: {
      type: Number,
      required: true,
      default: 0,
    },
    netAmount: {
      type: Number,
      required: true,
      default: 0,
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
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  },
  { timestamps: true }
);

// Indexes
earningSchema.index({ sellerId: 1, status: 1 });
earningSchema.index({ sellerId: 1, createdAt: -1 });

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
      min: 1,
    },
    bankDetails: {
      accountNumber: { type: String, default: "" },
      ifscCode: { type: String, default: "" },
      accountHolder: { type: String, default: "" },
      bankName: { type: String, default: "" },
    },
    upiId: {
      type: String,
      default: "",
    },
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
    processedAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Indexes
withdrawalSchema.index({ sellerId: 1, status: 1 });
withdrawalSchema.index({ sellerId: 1, createdAt: -1 });

module.exports = {
  Earning: mongoose.model("Earning", earningSchema),
  Withdrawal: mongoose.model("Withdrawal", withdrawalSchema),
};