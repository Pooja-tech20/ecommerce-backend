// const Product = require("../../models/seller/Product");
// const Order = require("../../models/Order");

// // ==============================
// // Seller Dashboard
// // ==============================

// exports.getDashboard = async (req, res) => {
//   try {
//     const sellerId = req.seller._id;

//     // Total Products
//     const totalProducts = await Product.countDocuments({
//       seller: sellerId,
//     });

//     // Pending Orders
//     const pendingOrders = await Order.countDocuments({
//       seller: sellerId,
//       status: "Pending",
//     });

//     // Completed Orders
//     const completedOrders = await Order.countDocuments({
//       seller: sellerId,
//       status: "Delivered",
//     });

//     // Low Stock
//     const lowStock = await Product.countDocuments({
//       seller: sellerId,
//       stock: { $lte: 5 },
//     });

//     // Total Sales
//     const deliveredOrders = await Order.find({
//       seller: sellerId,
//       status: "Delivered",
//     });

//     let totalSales = 0;

//     deliveredOrders.forEach((order) => {
//       totalSales += order.totalAmount;
//     });

//     res.status(200).json({
//       success: true,
//       dashboard: {
//         totalProducts,
//         pendingOrders,
//         completedOrders,
//         totalSales,
//         lowStock,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

const Product = require("../../models/seller/Product");
const OrderItem = require("../../models/OrderItem");

// ==============================
// Seller Dashboard
// ==============================
// NOTE: A seller never owns a whole customer Order (an Order can contain
// products from many sellers). Every seller-scoped stat must therefore be
// derived from OrderItem (which carries `sellerId`), not from the Order
// model directly.

exports.getDashboard = async (req, res) => {
  try {
    const sellerId = req.seller._id;

    // Total Products listed by this seller
    const totalProducts = await Product.countDocuments({
      sellerId,
    });

    // Low Stock Products
    const lowStock = await Product.countDocuments({
      sellerId,
      stock: { $lte: 5 },
    });

    // Pending Orders (order items not yet delivered/cancelled/returned)
    const pendingOrders = await OrderItem.countDocuments({
      sellerId,
      status: { $in: ["Pending", "Confirmed", "Processing", "Shipped", "Out for Delivery"] },
    });

    // Completed Orders (delivered order items)
    const completedOrders = await OrderItem.countDocuments({
      sellerId,
      status: "Delivered",
    });

    // Total Sales (sum of subtotal for delivered order items)
    const salesAgg = await OrderItem.aggregate([
      { $match: { sellerId, status: "Delivered" } },
      { $group: { _id: null, total: { $sum: "$subtotal" } } },
    ]);

    const totalSales = salesAgg.length > 0 ? salesAgg[0].total : 0;

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