const Settings = require("../models/Settings");
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const settings = await Settings.findOne();

    if (!settings || !settings.maintenanceMode) {
      return next();
    }

    // Routes that should always work
    const allowedRoutes = [
      "/api/auth",
      "/api/admin",
      "/api/settings",
      "/api/otp",
      "/uploads"
    ];

    if (allowedRoutes.some(route => req.originalUrl.startsWith(route))) {
      return next();
    }

    // Allow admin users with a valid token
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role === "admin") {
          return next();
        }
      } catch (err) {
        // Ignore invalid token and continue to maintenance response
      }
    }

    return res.status(503).json({
      success: false,
      maintenance: true,
      message: "Website is under maintenance. Please try again later."
    });

  } catch (err) {
    console.error(err);
    next();
  }
};