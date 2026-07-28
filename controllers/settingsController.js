const Settings = require("../models/Settings");

// Fetch (or lazily create) the single settings document
const getOrCreateSettings = async () => {
  let settings = await Settings.findOne({ key: "store_settings" });
  if (!settings) {
    settings = await Settings.create({ key: "store_settings" });
  }
  return settings;
};

// @desc    Get store settings
// @route   GET /api/admin/settings
// @access  Private/Admin
const getSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();

    res.status(200).json({
      success: true,
      general: settings.general,
      notifications: settings.notifications,
      payment: settings.payment,
      integrations: settings.integrations,
      backup: settings.backup,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch settings",
    });
  }
};

// @desc    Update store settings (any subset of sections)
// @route   PUT /api/admin/settings
// @access  Private/Admin
const updateSettings = async (req, res) => {
  try {
    const { general, notifications, payment, integrations, backup } = req.body;

    const settings = await getOrCreateSettings();

    if (general) settings.general = { ...settings.general.toObject(), ...general };
    if (notifications)
      settings.notifications = { ...settings.notifications.toObject(), ...notifications };
    if (payment) settings.payment = { ...settings.payment.toObject(), ...payment };
    if (integrations)
      settings.integrations = { ...settings.integrations.toObject(), ...integrations };
    if (backup) settings.backup = { ...settings.backup.toObject(), ...backup };

    await settings.save();

    res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      general: settings.general,
      notifications: settings.notifications,
      payment: settings.payment,
      integrations: settings.integrations,
      backup: settings.backup,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update settings",
    });
  }
};

// @desc    Trigger a manual backup
// @route   POST /api/admin/settings/backup/run
// @access  Private/Admin
const runBackupNow = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();

    // Replace this block with your real backup job (DB dump, S3 upload, etc).
    // For now we just record that a backup "happened".
    const lastBackup = new Date().toISOString().replace("T", " ").slice(0, 19);
    const backupSize = settings.backup.backupSize || "0 MB";

    settings.backup.lastBackup = lastBackup;
    settings.backup.backupSize = backupSize;
    await settings.save();

    res.status(200).json({
      success: true,
      message: "Backup completed",
      lastBackup,
      backupSize,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to run backup",
    });
  }
};

module.exports = {
  getSettings,
  updateSettings,
  runBackupNow,
};