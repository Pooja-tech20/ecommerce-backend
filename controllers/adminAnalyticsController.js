const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const User = require("../models/User");

// ==========================================
// Admin Analytics
// ==========================================
const getAnalytics = async (req, res) => {
  try {
    // ============================
    // Monthly Revenue
    // ============================
    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          paymentStatus: "paid",
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
          },
          revenue: {
            $sum: "$totalAmount",
          },
        },
      },
      {
        $sort: {
          "_id.month": 1,
        },
      },
    ]);

    // ============================
    // Monthly Orders
    // ============================
    const monthlyOrders = await Order.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
          },
          orders: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          "_id.month": 1,
        },
      },
    ]);

    // ============================
    // Top Selling Products
    // ============================
    const topProducts = await OrderItem.aggregate([
      {
        $group: {
          _id: "$productName",
          sold: {
            $sum: "$quantity",
          },
        },
      },
      {
        $sort: {
          sold: -1,
        },
      },
      {
        $limit: 5,
      },
    ]);

    // ============================
    // Top Customers
    // ============================
    const topCustomers = await Order.aggregate([
      {
        $match: {
          paymentStatus: "paid",
        },
      },
      {
        $group: {
          _id: "$user",
          totalSpent: {
            $sum: "$totalAmount",
          },
        },
      },
      {
        $sort: {
          totalSpent: -1,
        },
      },
      {
        $limit: 5,
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "customer",
        },
      },
      {
        $unwind: "$customer",
      },
      {
        $project: {
          _id: 0,
          customer: "$customer.fullName",
          phone: "$customer.phone",
          totalSpent: 1,
        },
      },
    ]);

    // ============================
    // Top Categories
    // ============================
    const topCategories = await OrderItem.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $unwind: "$product",
      },
      {
        $group: {
          _id: "$product.category",
          sold: {
            $sum: "$quantity",
          },
        },
      },
      {
        $sort: {
          sold: -1,
        },
      },
      {
        $limit: 5,
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          sold: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      analytics: {
        monthlyRevenue,
        monthlyOrders,
        topProducts,
        topCategories,
        topCustomers,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAnalytics,
};