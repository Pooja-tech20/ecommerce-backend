const Settings = require("../models/Settings");

// GET SETTINGS
exports.getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({});
    }

    res.status(200).json({
      success: true,
      settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET PUBLIC SETTINGS
// Customer-facing subset only — never expose SMTP credentials, the Google
// Maps API key, or backup info to unauthenticated storefront visitors.
exports.getPublicSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({});
    }

    const {
      storeName,
      storeEmail,
      phone,
      address,
      currency,
      logo,
      favicon,
      maintenanceMode,
      allowRegistration,
      guestCheckout,
      cod,
      upi,
      stripe,
      razorpay,
      deliveryCharge,
      freeDeliveryAbove,
      deliveryDays,
      gst,
    } = settings;

    res.status(200).json({
      success: true,
      settings: {
        storeName,
        storeEmail,
        phone,
        address,
        currency,
        logo,
        favicon,
        maintenanceMode,
        allowRegistration,
        guestCheckout,
        cod,
        upi,
        stripe,
        razorpay,
        deliveryCharge,
        freeDeliveryAbove,
        deliveryDays,
        gst,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE SETTINGS
exports.updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({});
    }

    Object.keys(req.body).forEach((key) => {
      settings[key] = req.body[key];
    });

    await settings.save();

    res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};