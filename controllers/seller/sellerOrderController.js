const Order = require("../../models/Order");
const Product = require("../../models/Product");
const { Earning } = require("../../models/Earning");

// 📋 Get All Orders
exports.getOrders = async (req, res) => {
  try {
    const sellerId = req.seller._id;
    const { page = 1, limit = 10, status, paymentStatus, search } = req.query;

    const query = { sellerId };
    if (status) query.status = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    if (search) {
      query.$or = [
        { orderId: { $regex: search, $options: "i" } },
        { "shippingAddress.fullName": { $regex: search, $options: "i" } },
      ];
    }

    const orders = await Order.find(query)
      .populate("products.productId", "name images")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 🔍 Get Single Order
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      sellerId: req.seller._id,
    }).populate("products.productId", "name images price");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 📦 Update Order Status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingNumber, courierName, notes } = req.body;
    
    const order = await Order.findOne({
      _id: req.params.id,
      sellerId: req.seller._id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Validate status transition
    const validTransitions = {
      Pending: ["Confirmed", "Cancelled"],
      Confirmed: ["Processing", "Cancelled"],
      Processing: ["Shipped", "Cancelled"],
      Shipped: ["Out for Delivery"],
      "Out for Delivery": ["Delivered"],
      Delivered: [],
      Cancelled: [],
      Returned: [],
    };

    if (!validTransitions[order.status]?.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status transition from ${order.status} to ${status}`,
      });
    }

    order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (courierName) order.courierName = courierName;
    if (notes) order.notes = notes;
    
    if (status === "Delivered") {
      order.deliveredAt = new Date();
      order.paymentStatus = "Paid";
      
      // Create earning record
      const earning = new Earning({
        sellerId: order.sellerId,
        orderId: order._id,
        amount: order.totalAmount,
        commission: order.commission || 0,
        netAmount: order.netEarning || order.totalAmount - (order.commission || 0),
        status: "Pending",
        description: `Earning from order ${order.orderId}`,
      });
      await earning.save();
    }

    if (status === "Cancelled") {
      order.cancelledAt = new Date();
      
      // Restore product stock
      for (const item of order.products) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: item.quantity },
        });
      }
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 🚚 Update Tracking
exports.updateTracking = async (req, res) => {
  try {
    const { trackingNumber, courierName } = req.body;
    
    const order = await Order.findOne({
      _id: req.params.id,
      sellerId: req.seller._id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.trackingNumber = trackingNumber || order.trackingNumber;
    order.courierName = courierName || order.courierName;
    await order.save();

    res.status(200).json({
      success: true,
      message: "Tracking updated successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 📊 Order Stats
exports.getOrderStats = async (req, res) => {
  try {
    const sellerId = req.seller._id;

    const stats = await Order.aggregate([
      { $match: { sellerId: sellerId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalAmount: { $sum: "$totalAmount" },
        },
      },
    ]);

    const dailyStats = await Order.aggregate([
      { $match: { sellerId: sellerId } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
          total: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: -1 } },
      { $limit: 30 },
    ]);

    res.status(200).json({
      success: true,
      data: {
        byStatus: stats,
        daily: dailyStats,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};