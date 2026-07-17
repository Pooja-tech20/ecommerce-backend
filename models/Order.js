const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // Order Number
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },

    // User
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Shipping Address
    shippingAddress: {
      fullName: {
        type: String,
        required: true,
      },

      phone: {
        type: String,
        required: true,
      },

      address: {
        type: String,
        required: true,
      },

      city: {
        type: String,
        required: true,
      },

      state: {
        type: String,
        required: true,
      },

      pincode: {
        type: String,
        required: true,
      },
    },

    // Price Details
    subtotal: {
      type: Number,
      required: true,
      default: 0,
    },

    discount: {
      type: Number,
      default: 0,
    },

    deliveryFee: {
      type: Number,
      default: 0,
    },

    tax: {
      type: Number,
      default: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    // Payment
    paymentMethod: {
      type: String,
      enum: ["cod", "online"],
      default: "cod",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    // Order Status
    orderStatus: {
      type: String,
      enum: [
        "placed",
        "confirmed",
        "packed",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ],
      default: "placed",
    },

    // Tracking
    tracking: {
      status: {
        type: String,
        enum: [
          "Order Placed",
          "Confirmed",
          "Packed",
          "Shipped",
          "Out For Delivery",
          "Delivered",
          "Cancelled",
        ],
        default: "Order Placed",
      },

      currentLocation: {
        type: String,
        default: "Warehouse",
      },

      estimatedDelivery: {
        type: Date,
        default: null,
      },

      trackingHistory: [
        {
          status: {
            type: String,
          },

          location: {
            type: String,
          },

          time: {
            type: Date,
            default: Date.now,
          },
        },
      ],
    },

    // Dates
    placedAt: {
      type: Date,
      default: Date.now,
    },

    deliveredAt: {
      type: Date,
      default: null,
    },

    estimatedDeliveryTime: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);