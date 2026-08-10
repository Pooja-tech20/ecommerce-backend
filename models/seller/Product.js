const mongoose = require("mongoose");

const sellerProductSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    subCategory: {
      type: String,
      default: "",
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    discountPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    images: {
      type: [String],
      default: [],
    },

    variants: [
      {
        size: String,
        color: String,
        price: Number,
        stock: Number,
        sku: String,
      },
    ],

    specifications: {
      type: Map,
      of: String,
      default: {},
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    views: {
      type: Number,
      default: 0,
    },

    soldCount: {
      type: Number,
      default: 0,
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
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.SellerProduct ||
  mongoose.model("SellerProduct", sellerProductSchema);