const Product = require("../../models/Product");
const Order = require("../../models/Order");

// ==============================
// Seller Dashboard
// ==============================

exports.getDashboard = async (req, res) => {
  try {
    const sellerId = req.seller._id;

    // Total Products
    const totalProducts = await Product.countDocuments({
      seller: sellerId,
    });

    // Pending Orders
    const pendingOrders = await Order.countDocuments({
      seller: sellerId,
      status: "Pending",
    });

    // Completed Orders
    const completedOrders = await Order.countDocuments({
      seller: sellerId,
      status: "Delivered",
    });

    // Low Stock
    const lowStock = await Product.countDocuments({
      seller: sellerId,
      stock: { $lte: 5 },
    });

    // Total Sales
    const deliveredOrders = await Order.find({
      seller: sellerId,
      status: "Delivered",
    });

    let totalSales = 0;

    deliveredOrders.forEach((order) => {
      totalSales += order.totalAmount;
    });

    res.status(200).json({
      success: true,
      dashboard: {
        totalProducts,
        pendingOrders,
        completedOrders,
        totalSales,
        lowStock,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};