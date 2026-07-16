const Order = require("../models/Order");

// ==============================
// Get Tracking
// ==============================

exports.getTracking = async (req, res) => {
  try {

    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      tracking: order.tracking,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ==============================
// Update Tracking (Admin)
// ==============================

exports.updateTracking = async (req, res) => {
  try {

    const { status, location } = req.body;

    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.tracking.status = status;

    order.tracking.currentLocation = location;

    order.tracking.trackingHistory.push({
      status,
      location,
    });

    await order.save();

    res.json({
      success: true,
      message: "Tracking Updated",
      tracking: order.tracking,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};