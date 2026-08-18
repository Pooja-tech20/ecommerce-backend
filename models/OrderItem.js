const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    // Order Reference
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    // Product Reference
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    // Product Snapshot
    productName: {
      type: String,
      required: true,
      trim: true,
    },

    productImage: {
      type: String,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    price: {
      type: Number,
      required: true,
    },

    subtotal: {
      type: Number,
      required: true,
    },

    // Seller Reference (which seller this line item belongs to)
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      index: true,
    },

    // Per-seller fulfilment status for this line item
    status: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Processing",
        "Shipped",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
        "Returned",
      ],
      default: "Pending",
    },

    trackingNumber: {
      type: String,
      default: "",
    },

    courierName: {
      type: String,
      default: "",
    },

    notes: {
      type: String,
      default: "",
    },

    commission: {
      type: Number,
      default: 0,
    },

    netEarning: {
      type: Number,
      default: 0,
    },

    deliveredAt: {
      type: Date,
      default: null,
    },

    cancelledAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

orderItemSchema.index({ sellerId: 1, status: 1 });
orderItemSchema.index({ sellerId: 1, createdAt: -1 });

module.exports = mongoose.model("OrderItem", orderItemSchema);