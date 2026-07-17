const User = require("../models/User");
const Product = require("../models/Product");
const Category = require("../models/Category");
const Order = require("../models/Order");

// ================= Dashboard =================

exports.dashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalProducts = await Product.countDocuments();

    const totalCategories = await Category.countDocuments();

    const totalOrders = await Order.countDocuments();

    const deliveredOrders = await Order.countDocuments({
      orderStatus: "delivered",
    });

    const pendingOrders = await Order.countDocuments({
      orderStatus: "placed",
    });

    const cancelledOrders = await Order.countDocuments({
      orderStatus: "cancelled",
    });

    const revenue = await Order.aggregate([
      {
        $match: {
          orderStatus: "delivered",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$totalAmount",
          },
        },
      },
    ]);

    const totalRevenue =
      revenue.length > 0 ? revenue[0].totalRevenue : 0;

    const lowStockProducts = await Product.find({
      stock: { $lte: 10 },
    }).select("name stock");

    const recentOrders = await Order.find()
      .populate("user", "fullName phone")
      .sort({ createdAt: -1 })
      .limit(5);

    const formattedOrders = recentOrders.map((order) => ({
      orderNumber: order.orderNumber,

      customer: {
        fullName: order.user?.fullName || "",
        phone: order.user?.phone || "",
      },

      shippingAddress: {
        fullName: order.shippingAddress?.fullName,
        phone: order.shippingAddress?.phone,
        address: order.shippingAddress?.address,
        city: order.shippingAddress?.city,
        state: order.shippingAddress?.state,
        pincode: order.shippingAddress?.pincode,
      },

      subtotal: order.subtotal,
      discount: order.discount,
      deliveryFee: order.deliveryFee,
      tax: order.tax,
      totalAmount: order.totalAmount,

      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,

      tracking: {
        status: order.tracking?.status,
        currentLocation: order.tracking?.currentLocation,
        estimatedDelivery: order.tracking?.estimatedDelivery,

        trackingHistory:
          order.tracking?.trackingHistory?.map((history) => ({
            status: history.status,
            location: history.location,
            time: history.time,
          })) || [],
      },

      placedAt: order.placedAt,
      deliveredAt: order.deliveredAt,
    }));

    res.status(200).json({
      success: true,
      dashboard: {
        totalUsers,
        totalProducts,
        totalCategories,
        totalOrders,
        deliveredOrders,
        pendingOrders,
        cancelledOrders,
        totalRevenue,
        lowStockProducts,
        recentOrders: formattedOrders,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= Get All Users =================

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= Get User By ID =================

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= Update User =================

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.fullName = req.body.fullName || user.fullName;
    user.phone = req.body.phone || user.phone;
    user.role = req.body.role || user.role;

    if (req.body.email) {
      user.email = req.body.email;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= Delete User =================

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= Block / Unblock User =================
// Requires `isBlocked: { type: Boolean, default: false }` on the User model

exports.blockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.isBlocked = !user.isBlocked;

    await user.save();

    res.status(200).json({
      success: true,
      message: user.isBlocked
        ? "User blocked successfully"
        : "User unblocked successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= Sales Report =================

exports.salesReport = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();

    const deliveredOrders = await Order.countDocuments({
      orderStatus: "delivered",
    });

    const pendingOrders = await Order.countDocuments({
      orderStatus: "placed",
    });

    const cancelledOrders = await Order.countDocuments({
      orderStatus: "cancelled",
    });

    const revenue = await Order.aggregate([
      {
        $match: {
          orderStatus: "delivered",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$totalAmount",
          },
        },
      },
    ]);

    const totalRevenue =
      revenue.length > 0 ? revenue[0].totalRevenue : 0;

    const monthlySales = await Order.aggregate([
      {
        $match: {
          orderStatus: "delivered",
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          revenue: { $sum: "$totalAmount" },
          orders: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      report: {
        totalOrders,
        deliveredOrders,
        pendingOrders,
        cancelledOrders,
        totalRevenue,
        monthlySales,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};