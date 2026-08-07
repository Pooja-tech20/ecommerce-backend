const Settings = require("../models/Settings");

// ─── Helper: get or create the single settings document ──────────────
const getOrCreateSettings = async () => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({});
  }
  return settings;
};

// ─── GET all settings (admin) ──────────────────────────────────────────
exports.getSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    res.status(200).json({ success: true, settings });
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── UPDATE settings (admin) ──────────────────────────────────────────
exports.updateSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();

    // Update only the fields that are sent in the request body
    Object.keys(req.body).forEach((key) => {
      // Optional: validate key exists on schema to avoid unwanted fields
      if (settings.schema.paths[key]) {
        settings[key] = req.body[key];
      }
    });

    await settings.save();

    res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      settings,
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET public settings (unauthenticated visitors) ──────────────────
exports.getPublicSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();

    // Only expose fields that are safe for the storefront
    const publicFields = {
      storeName: settings.storeName,
      storeEmail: settings.storeEmail,
      phone: settings.phone,
      address: settings.address,
      currency: settings.currency,
      logo: settings.logo,
      favicon: settings.favicon,
      maintenanceMode: settings.maintenanceMode,
      allowRegistration: settings.allowRegistration,
      guestCheckout: settings.guestCheckout,
      cod: settings.cod,
      upi: settings.upi,
      stripe: settings.stripe,
      razorpay: settings.razorpay,
      deliveryCharge: settings.deliveryCharge,
      freeDeliveryAbove: settings.freeDeliveryAbove,
      deliveryDays: settings.deliveryDays,
      gst: settings.gst,
    };

    res.status(200).json({ success: true, settings: publicFields });
  } catch (error) {
    console.error("Error fetching public settings:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── MANUAL BACKUP (placeholder) ──────────────────────────────────────
exports.runBackupNow = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();

    // Replace with your real backup logic (e.g., database dump, S3 upload)
    const now = new Date();
    const lastBackup = now.toISOString().replace("T", " ").slice(0, 19); // "YYYY-MM-DD HH:mm:ss"
    const backupSize = "10.5 MB"; // compute actual size if possible

    settings.backupLastBackup = lastBackup;
    settings.backupSize = backupSize;
    await settings.save();

    res.status(200).json({
      success: true,
      message: "Backup completed successfully",
      lastBackup,
      backupSize,
    });
  } catch (error) {
    console.error("Error running backup:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};