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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("OrderItem", orderItemSchema);