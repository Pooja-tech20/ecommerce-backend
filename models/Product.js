// const mongoose = require("mongoose");

// const productSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     description: {
//       type: String,
//       required: true,
//     },

//     category: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Category",
//       required: true,
//     },

//     price: {
//       type: Number,
//       required: true,
//     },

//     originalPrice: {
//       type: Number,
//       default: 0,
//     },

//     stock: {
//       type: Number,
//       default: 0,
//     },

//     status: {
//       type: String,
//       enum: ["In Stock", "Out of Stock"],
//       default: "In Stock",
//     },

//     unit: {
//       type: String,
//       required: true,
//       default: "1 pc",
//     },

//     image: {
//       type: String,
//       required: true,
//     },

//     // Average Rating
//     rating: {
//       type: Number,
//       default: 0,
//     },

//     // Total Reviews
//     numReviews: {
//       type: Number,
//       default: 0,
//     },

//     // Review References
//     reviews: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Review",
//       },
//     ],
//   },
//   {
//     timestamps: true,
//   }
// );

// module.exports = mongoose.model("Product", productSchema);

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
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
      type: String,
      required: true,
    },
    subCategory: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discountPrice: {
      type: Number,
      default: 0,
    },
    originalPrice: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["In Stock", "Out of Stock"],
      default: "In Stock",
    },
    unit: {
      type: String,
      default: "1 pc",
    },
    images: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
      default: "",
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
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  { timestamps: true }
);

// Index for better query performance
productSchema.index({ sellerId: 1, category: 1 });
productSchema.index({ sellerId: 1, name: "text" });

// Auto-update status based on stock
productSchema.pre("save", function () {
  if (this.stock <= 0) {
    this.status = "Out of Stock";
  } else {
    this.status = "In Stock";
  }
});

//module.exports = mongoose.model("Product", productSchema);
module.exports =
  mongoose.models.Product ||
  mongoose.model("Product", productSchema);