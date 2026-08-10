// const mongoose = require("mongoose");

// const sellerReviewSchema = new mongoose.Schema(
//   {
//     seller: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Seller",
//       required: true,
//     },

//     customer: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     order: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Order",
//       required: true,
//     },

//     rating: {
//       type: Number,
//       required: true,
//       min: 1,
//       max: 5,
//     },

//     comment: {
//       type: String,
//       trim: true,
//       maxlength: 500,
//     },

//     status: {
//       type: String,
//       enum: ["pending", "approved", "rejected"],
//       default: "pending",
//     },

//     sellerReply: {
//       type: String,
//       trim: true,
//       maxlength: 500,
//     },

//     repliedAt: {
//       type: Date,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // One customer can review a seller only once for an order
// sellerReviewSchema.index(
//   {
//     seller: 1,
//     customer: 1,
//     order: 1,
//   },
//   {
//     unique: true,
//   }
// );

// module.exports = mongoose.model("Seller", sellerSchema);

const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    storeName: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
    },

    city: {
      type: String,
      trim: true,
    },

    state: {
      type: String,
      trim: true,
    },

    pincode: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "blocked"],
      default: "pending",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    logo: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },

    totalProducts: {
      type: Number,
      default: 0,
    },

    totalOrders: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Seller", sellerSchema);