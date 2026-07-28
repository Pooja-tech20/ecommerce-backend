const mongoose = require("mongoose");

// Single-document collection: the whole app only ever has ONE settings
// document. We enforce that with a fixed key below.
const settingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: "store_settings",
      unique: true,
    },

    general: {
      storeName: { type: String, default: "RudraGroceries" },
      storeEmail: { type: String, default: "info@rudragroceries.com" },
      storePhone: { type: String, default: "+91 98765 43210" },
      storeAddress: { type: String, default: "123, Main Street, Mumbai, India" },
      timezone: { type: String, default: "Asia/Kolkata" },
      currency: { type: String, default: "INR" },
      language: { type: String, default: "en" },
      maintenanceMode: { type: Boolean, default: false },
      registrationEnabled: { type: Boolean, default: true },
      emailVerification: { type: Boolean, default: true },
    },

    notifications: {
      pushNotifications: { type: Boolean, default: true },
      smsNotifications: { type: Boolean, default: false },
      orderUpdates: { type: Boolean, default: true },
      customerAlerts: { type: Boolean, default: true },
      inventoryAlerts: { type: Boolean, default: true },
      systemUpdates: { type: Boolean, default: true },
      weeklyReports: { type: Boolean, default: true },
      dailyDigest: { type: Boolean, default: false },
    },

    payment: {
      currency: { type: String, default: "INR" },
      taxRate: { type: Number, default: 18 },
      shippingCost: { type: Number, default: 50 },
      freeShippingThreshold: { type: Number, default: 500 },
      paymentMethods: {
        cod: { type: Boolean, default: true },
        online: { type: Boolean, default: true },
        upi: { type: Boolean, default: true },
      },
    },

    integrations: {
      stripe: {
        enabled: { type: Boolean, default: false },
        apiKey: { type: String, default: "" },
        webhookSecret: { type: String, default: "" },
      },
      razorpay: {
        enabled: { type: Boolean, default: false },
        apiKey: { type: String, default: "" },
        webhookSecret: { type: String, default: "" },
      },
      googleAnalytics: {
        enabled: { type: Boolean, default: false },
        trackingId: { type: String, default: "" },
      },
    },

    backup: {
      autoBackup: { type: Boolean, default: true },
      backupFrequency: { type: String, default: "daily" },
      retentionDays: { type: Number, default: 30 },
      lastBackup: { type: String, default: null },
      backupSize: { type: String, default: null },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Settings", settingsSchema);