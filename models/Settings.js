const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      default: "Rudra Groceries",
    },

    storeEmail: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    currency: {
      type: String,
      default: "INR",
    },

    timezone: {
      type: String,
      default: "Asia/Kolkata",
    },

    logo: {
      type: String,
      default: "",
    },

    favicon: {
      type: String,
      default: "",
    },

    maintenanceMode: {
      type: Boolean,
      default: false,
    },

    allowRegistration: {
      type: Boolean,
      default: true,
    },

    guestCheckout: {
      type: Boolean,
      default: true,
    },

    orderNotification: {
      type: Boolean,
      default: true,
    },

    stockAlert: {
      type: Boolean,
      default: true,
    },

    customerNotification: {
      type: Boolean,
      default: true,
    },

    emailNotification: {
      type: Boolean,
      default: true,
    },

    cod: {
      type: Boolean,
      default: true,
    },

    razorpay: {
      type: Boolean,
      default: false,
    },

    upi: {
      type: Boolean,
      default: true,
    },

    stripe: {
      type: Boolean,
      default: false,
    },

    deliveryCharge: {
      type: Number,
      default: 50,
    },

    freeDeliveryAbove: {
      type: Number,
      default: 500,
    },

    deliveryDays: {
      type: Number,
      default: 2,
    },

    gst: {
      type: Number,
      default: 5,
    },

    smtpHost: String,

    smtpEmail: String,

    smtpPassword: String,

    googleMapApi: String,

    autoBackup: {
      type: Boolean,
      default: false,
    },

    backupFrequency: {
      type: String,
      default: "Weekly",
    },

    lastBackup: Date,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Settings", settingsSchema);