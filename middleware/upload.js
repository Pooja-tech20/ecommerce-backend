const Settings = require("../models/Settings");

const maintenanceMode = async (req, res, next) => {
  try {
    const settings = await Settings.findOne();

    // No settings found
    if (!settings) {
      return next();
    }

    // If maintenance mode is OFF
    if (!settings.maintenanceMode) {
      return next();
    }

    // Allow Admin APIs
    if (req.originalUrl.startsWith("/api/admin")) {
      return next();
    }

    // Allow Login/Register
    if (req.originalUrl.startsWith("/api/auth")) {
      return next();
    }

    // Allow Public Settings API
    if (req.originalUrl.startsWith("/api/settings/public")) {
      return next();
    }

    return res.status(503).json({
      success: false,
      maintenance: true,
      message: "🚧 Website is under maintenance. Please try again later.",
    });
  } catch (error) {
    next();
  }
};

module.exports = maintenanceMode;