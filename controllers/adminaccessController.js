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
    })
      .select("name stock")
      .limit(10);

    const recentOrders = await Order.find()
      .populate("user", "fullName phone")
      .sort({ createdAt: -1 })
      .limit(5);

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
        recentOrders,
      },
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};