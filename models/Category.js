console.log("Category model loaded");
const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },
    image:
      {
      type: String,
      required: true,
    },
    deliveryDays: {
    type: Number,
    required: true,
    default: 2,
    min: 1
},

     isActive: {
      type: Boolean,
      default: true,
    },

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Category", categorySchema);