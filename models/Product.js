const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    originalPrice: {
      type: Number,
      default: 0,
    },

    stock: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["In Stock", "Out of Stock"],
      default: "In Stock",
    },

    unit: {
      type: String,
      required: true,
      default: "1 pc",
    },

    image: {
      type: String,
      required: true,
    },

    // Average Rating
    rating: {
      type: Number,
      default: 0,
    },

    // Total Reviews
    numReviews: {
      type: Number,
      default: 0,
    },

    // Review References
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);