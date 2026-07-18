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
  unit: {
  type: String,
  required: true,
  enum: [
    "1 pc",
    "2 pcs",
    "4 pcs",
    "6 pcs",
    "250 g",
    "500 g",
    "1 kg",
    "2 kg",
    "100 ml",
    "250 ml",
    "500 ml",
    "1 L",
    "1 loaf",
    "1 pack",
    "1 box"
  ],
  default: "1 pc",
},

    image: {
      type: String,
      
      required: true,
    },

    rating: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);