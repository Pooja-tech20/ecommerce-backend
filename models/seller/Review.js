// const mongoose = require("mongoose");

// const reviewSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     product: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Product",
//       required: true,
//     },
//     sellerId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Seller",
//       required: true,
//     },
//     orderId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Order",
//       default: null,
//     },
//     orderItemId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "OrderItem",
//       default: null,
//     },
//     rating: {
//       type: Number,
//       required: true,
//       min: 1,
//       max: 5,
//     },
//     comment: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     images: {
//       type: [String],
//       default: [],
//     },
//     reviewerType: {
//       type: String,
//       enum: ["user", "admin"],
//       default: "user",
//     },
//     status: {
//       type: String,
//       enum: ["pending", "approved", "reported", "hidden"],
//       default: "pending",
//     },
//     sellerVisibility: {
//       type: String,
//       enum: ["Published", "Hidden", "Reported"],
//       default: "Published",
//     },
//     reportReason: {
//       type: String,
//       default: "",
//     },
//     reportedBy: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//       },
//     ],
//     reply: {
//       text: String,
//       repliedAt: Date,
//       repliedBy: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//       },
//     },
//     helpfulCount: {
//       type: Number,
//       default: 0,
//     },
//     helpfulUsers: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//       },
//     ],
//     verifiedPurchase: {
//       type: Boolean,
//       default: false,
//     },
//     verifiedAt: {
//       type: Date,
//       default: null,
//     },
//     isFeatured: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   { 
//     timestamps: true,
//     collection: "sellerreviews" // ✅ THIS IS THE FIX - Use sellerreviews collection
//   }
// );

// // Indexes
// reviewSchema.index({ product: 1, user: 1 });
// reviewSchema.index({ sellerId: 1 });
// reviewSchema.index({ status: 1 });
// reviewSchema.index({ rating: 1 });
// reviewSchema.index({ createdAt: -1 });
// reviewSchema.index({ sellerVisibility: 1 });

// module.exports = mongoose.model("SellerReview", reviewSchema); // Keep name as "SellerReview"

const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    // Customer
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Product
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    // Seller who owns the product
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },

    // Optional order information
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },

    orderItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderItem",
      default: null,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      required: true,
      trim: true,
    },

    reviewerType: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    verifiedPurchase: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "reported", "hidden"],
      default: "approved",
    },

    helpfulCount: {
      type: Number,
      default: 0,
    },

    // Seller reply
    reply: {
      text: {
        type: String,
        default: "",
        trim: true,
      },

      repliedAt: {
        type: Date,
        default: null,
      },

      repliedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seller",
        default: null,
      },
    },

    sellerVisibility: {
      type: String,
      enum: ["Published", "Hidden", "Reported"],
      default: "Published",
    },

    reportReason: {
      type: String,
      default: "",
    },

    reportedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    helpfulUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    verifiedAt: {
      type: Date,
      default: null,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.index({ product: 1, user: 1 });
reviewSchema.index({ sellerId: 1 });
reviewSchema.index({ status: 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ createdAt: -1 });

//module.exports = mongoose.model("SellerReview", reviewSchema);
module.exports =
  mongoose.models.SellerReview ||
  mongoose.model("SellerReview", reviewSchema);