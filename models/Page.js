const mongoose = require("mongoose");

const pageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
    },

    content: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
     order: {
    type: Number,
    default: 0
      },
    // Admin who created the page
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      
    },
    

    // Admin who last updated the page
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
   
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Page", pageSchema);