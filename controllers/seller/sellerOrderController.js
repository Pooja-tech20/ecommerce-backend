// // const Order = require("../../models/seller/Order");
// // const Product = require("../../models/Product");
// // //const { Earning } = require("../../models/Earning");
// // const { Earning } = require("../../models/seller/Earning");
// // // 📋 Get All Orders
// // exports.getOrders = async (req, res) => {
// //   try {
// //     const sellerId = req.seller._id;
// //     const { page = 1, limit = 10, status, paymentStatus, search } = req.query;

// //     const query = { sellerId };
// //     if (status) query.status = status;
// //     if (paymentStatus) query.paymentStatus = paymentStatus;
// //     if (search) {
// //       query.$or = [
// //         { orderId: { $regex: search, $options: "i" } },
// //         { "shippingAddress.fullName": { $regex: search, $options: "i" } },
// //       ];
// //     }

// //     const orders = await Order.find(query)
// //       .populate("products.productId", "name images")
// //       .sort({ createdAt: -1 })
// //       .skip((page - 1) * limit)
// //       .limit(parseInt(limit));

// //     const total = await Order.countDocuments(query);

// //     res.status(200).json({
// //       success: true,
// //       data: orders,
// //       pagination: {
// //         page: parseInt(page),
// //         limit: parseInt(limit),
// //         total,
// //         pages: Math.ceil(total / limit),
// //       },
// //     });
// //   } catch (error) {
// //     res.status(500).json({
// //       success: false,
// //       message: error.message,
// //     });
// //   }
// // };

// // // 🔍 Get Single Order
// // exports.getOrder = async (req, res) => {
// //   try {
// //     const order = await Order.findOne({
// //       _id: req.params.id,
// //       sellerId: req.seller._id,
// //     }).populate("products.productId", "name images price");

// //     if (!order) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Order not found",
// //       });
// //     }

// //     res.status(200).json({
// //       success: true,
// //       data: order,
// //     });
// //   } catch (error) {
// //     res.status(500).json({
// //       success: false,
// //       message: error.message,
// //     });
// //   }
// // };

// // // 📦 Update Order Status
// // exports.updateOrderStatus = async (req, res) => {
// //   try {
// //     const { status, trackingNumber, courierName, notes } = req.body;
    
// //     const order = await Order.findOne({
// //       _id: req.params.id,
// //       sellerId: req.seller._id,
// //     });

// //     if (!order) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Order not found",
// //       });
// //     }

// //     // Validate status transition
// //     const validTransitions = {
// //       Pending: ["Confirmed", "Cancelled"],
// //       Confirmed: ["Processing", "Cancelled"],
// //       Processing: ["Shipped", "Cancelled"],
// //       Shipped: ["Out for Delivery"],
// //       "Out for Delivery": ["Delivered"],
// //       Delivered: [],
// //       Cancelled: [],
// //       Returned: [],
// //     };

// //     if (!validTransitions[order.status]?.includes(status)) {
// //       return res.status(400).json({
// //         success: false,
// //         message: `Invalid status transition from ${order.status} to ${status}`,
// //       });
// //     }

// //     order.status = status;
// //     if (trackingNumber) order.trackingNumber = trackingNumber;
// //     if (courierName) order.courierName = courierName;
// //     if (notes) order.notes = notes;
    
// //     if (status === "Delivered") {
// //       order.deliveredAt = new Date();
// //       order.paymentStatus = "Paid";
      
// //       // Create earning record
// //       const earning = new Earning({
// //         sellerId: order.sellerId,
// //         orderId: order._id,
// //         amount: order.totalAmount,
// //         commission: order.commission || 0,
// //         netAmount: order.netEarning || order.totalAmount - (order.commission || 0),
// //         status: "Pending",
// //         description: `Earning from order ${order.orderId}`,
// //       });
// //       await earning.save();
// //     }

// //     if (status === "Cancelled") {
// //       order.cancelledAt = new Date();
      
// //       // Restore product stock
// //       for (const item of order.products) {
// //         await Product.findByIdAndUpdate(item.productId, {
// //           $inc: { stock: item.quantity },
// //         });
// //       }
// //     }

// //     await order.save();

// //     res.status(200).json({
// //       success: true,
// //       message: `Order status updated to ${status}`,
// //       data: order,
// //     });
// //   } catch (error) {
// //     res.status(500).json({
// //       success: false,
// //       message: error.message,
// //     });
// //   }
// // };

// // // 🚚 Update Tracking
// // exports.updateTracking = async (req, res) => {
// //   try {
// //     const { trackingNumber, courierName } = req.body;
    
// //     const order = await Order.findOne({
// //       _id: req.params.id,
// //       sellerId: req.seller._id,
// //     });

// //     if (!order) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Order not found",
// //       });
// //     }

// //     order.trackingNumber = trackingNumber || order.trackingNumber;
// //     order.courierName = courierName || order.courierName;
// //     await order.save();

// //     res.status(200).json({
// //       success: true,
// //       message: "Tracking updated successfully",
// //       data: order,
// //     });
// //   } catch (error) {
// //     res.status(500).json({
// //       success: false,
// //       message: error.message,
// //     });
// //   }
// // };

// // // 📊 Order Stats
// // exports.getOrderStats = async (req, res) => {
// //   try {
// //     const sellerId = req.seller._id;

// //     const stats = await Order.aggregate([
// //       { $match: { sellerId: sellerId } },
// //       {
// //         $group: {
// //           _id: "$status",
// //           count: { $sum: 1 },
// //           totalAmount: { $sum: "$totalAmount" },
// //         },
// //       },
// //     ]);

// //     const dailyStats = await Order.aggregate([
// //       { $match: { sellerId: sellerId } },
// //       {
// //         $group: {
// //           _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
// //           count: { $sum: 1 },
// //           total: { $sum: "$totalAmount" },
// //         },
// //       },
// //       { $sort: { _id: -1 } },
// //       { $limit: 30 },
// //     ]);

// //     res.status(200).json({
// //       success: true,
// //       data: {
// //         byStatus: stats,
// //         daily: dailyStats,
// //       },
// //     });
// //   } catch (error) {
// //     res.status(500).json({
// //       success: false,
// //       message: error.message,
// //     });
// //   }
// // };
// // ✅ FIXED PATHS - models are in models/seller/ folder
// const Order = require("../../models/seller/Order");
// const Product = require("../../models/Product");
// const Earning = require("../../models/seller/Earning");
// const Review = require("../../models/seller/Review");

// // ==================== GET ALL ORDERS ====================
// exports.getOrders = async (req, res) => {
//   try {
//     const sellerId = req.seller._id;
//     const { page = 1, limit = 10, status, paymentStatus, search } = req.query;

//     const query = { sellerId };
//     if (status) query.status = status;
//     if (paymentStatus) query.paymentStatus = paymentStatus;
//     if (search) {
//       query.$or = [
//         { orderId: { $regex: search, $options: "i" } },
//         { "shippingAddress.fullName": { $regex: search, $options: "i" } },
//       ];
//     }

//     const orders = await Order.find(query)
//       .populate("products.productId", "name images price")
//       .populate("customerId", "name email phone")
//       .sort({ createdAt: -1 })
//       .skip((page - 1) * limit)
//       .limit(parseInt(limit));

//     const total = await Order.countDocuments(query);

//     res.status(200).json({
//       success: true,
//       data: orders,
//       pagination: {
//         page: parseInt(page),
//         limit: parseInt(limit),
//         total,
//         pages: Math.ceil(total / limit),
//       },
//     });
//   } catch (error) {
//     console.error("Get orders error:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ==================== GET SINGLE ORDER ====================
// exports.getOrder = async (req, res) => {
//   try {
//     const order = await Order.findOne({
//       _id: req.params.id,
//       sellerId: req.seller._id,
//     })
//       .populate("products.productId", "name images price")
//       .populate("customerId", "name email phone address");

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: order,
//     });
//   } catch (error) {
//     console.error("Get order error:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ==================== UPDATE ORDER STATUS ====================
// exports.updateOrderStatus = async (req, res) => {
//   try {
//     const { status, trackingNumber, courierName, notes } = req.body;
    
//     if (!status) {
//       return res.status(400).json({
//         success: false,
//         message: "Status is required",
//       });
//     }

//     const order = await Order.findOne({
//       _id: req.params.id,
//       sellerId: req.seller._id,
//     });

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found",
//       });
//     }

//     // Validate status transition
//     const validTransitions = {
//       Pending: ["Confirmed", "Cancelled"],
//       Confirmed: ["Processing", "Cancelled"],
//       Processing: ["Shipped", "Cancelled"],
//       Shipped: ["Out for Delivery"],
//       "Out for Delivery": ["Delivered"],
//       Delivered: [],
//       Cancelled: [],
//       Returned: ["Confirmed", "Processing"],
//     };

//     if (!validTransitions[order.status]?.includes(status)) {
//       return res.status(400).json({
//         success: false,
//         message: `Invalid status transition from ${order.status} to ${status}`,
//       });
//     }

//     // Update order
//     order.status = status;
//     if (trackingNumber) order.trackingNumber = trackingNumber;
//     if (courierName) order.courierName = courierName;
//     if (notes) order.notes = notes;
    
//     // Handle Delivered status
//     if (status === "Delivered") {
//       order.deliveredAt = new Date();
//       order.paymentStatus = "Paid";
      
//       // Create earning record
//       const commission = order.commission || (order.totalAmount * 0.10);
//       const netAmount = order.totalAmount - commission;
      
//       const EarningModel = Earning; // Since Earning is exported as module
//       const earning = new EarningModel({
//         sellerId: order.sellerId,
//         orderId: order._id,
//         amount: order.totalAmount,
//         commission: commission,
//         netAmount: netAmount,
//         status: "Pending",
//         type: "Sale",
//         description: `Earning from order ${order.orderId}`,
//         availableAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
//       });
//       await earning.save();
//     }

//     // Handle Cancelled status
//     if (status === "Cancelled") {
//       order.cancelledAt = new Date();
      
//       // Restore product stock
//       for (const item of order.products) {
//         await Product.findByIdAndUpdate(item.productId, {
//           $inc: { stock: item.quantity },
//         });
//       }
//     }

//     await order.save();

//     res.status(200).json({
//       success: true,
//       message: `Order status updated to ${status}`,
//       data: order,
//     });
//   } catch (error) {
//     console.error("Update order status error:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ==================== UPDATE TRACKING ====================
// exports.updateTracking = async (req, res) => {
//   try {
//     const { trackingNumber, courierName } = req.body;
    
//     if (!trackingNumber && !courierName) {
//       return res.status(400).json({
//         success: false,
//         message: "At least one of trackingNumber or courierName is required",
//       });
//     }

//     const order = await Order.findOne({
//       _id: req.params.id,
//       sellerId: req.seller._id,
//     });

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found",
//       });
//     }

//     if (trackingNumber) order.trackingNumber = trackingNumber;
//     if (courierName) order.courierName = courierName;
//     await order.save();

//     res.status(200).json({
//       success: true,
//       message: "Tracking updated successfully",
//       data: order,
//     });
//   } catch (error) {
//     console.error("Update tracking error:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ==================== GET ORDER STATS ====================
// exports.getOrderStats = async (req, res) => {
//   try {
//     const sellerId = req.seller._id;

//     // Stats by status
//     const byStatus = await Order.aggregate([
//       { $match: { sellerId: sellerId } },
//       {
//         $group: {
//           _id: "$status",
//           count: { $sum: 1 },
//           totalAmount: { $sum: "$totalAmount" },
//         },
//       },
//     ]);

//     // Daily stats (last 30 days)
//     const dailyStats = await Order.aggregate([
//       { $match: { sellerId: sellerId } },
//       {
//         $group: {
//           _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
//           count: { $sum: 1 },
//           total: { $sum: "$totalAmount" },
//         },
//       },
//       { $sort: { _id: -1 } },
//       { $limit: 30 },
//     ]);

//     // Today's stats
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const tomorrow = new Date(today);
//     tomorrow.setDate(tomorrow.getDate() + 1);

//     const todayOrders = await Order.aggregate([
//       {
//         $match: {
//           sellerId: sellerId,
//           createdAt: { $gte: today, $lt: tomorrow },
//         },
//       },
//       {
//         $group: {
//           _id: null,
//           count: { $sum: 1 },
//           total: { $sum: "$totalAmount" },
//         },
//       },
//     ]);

//     res.status(200).json({
//       success: true,
//       data: {
//         byStatus,
//         daily: dailyStats,
//         today: {
//           orders: todayOrders[0]?.count || 0,
//           revenue: todayOrders[0]?.total || 0,
//         },
//         totalOrders: await Order.countDocuments({ sellerId }),
//         totalRevenue: await Order.aggregate([
//           { $match: { sellerId: sellerId } },
//           { $group: { _id: null, total: { $sum: "$totalAmount" } } },
//         ]).then(r => r[0]?.total || 0),
//       },
//     });
//   } catch (error) {
//     console.error("Get order stats error:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ==================== GET ORDER ANALYTICS ====================
// exports.getOrderAnalytics = async (req, res) => {
//   try {
//     const sellerId = req.seller._id;
//     const { days = 30 } = req.query;

//     const startDate = new Date();
//     startDate.setDate(startDate.getDate() - parseInt(days));

//     // Orders over time
//     const ordersOverTime = await Order.aggregate([
//       {
//         $match: {
//           sellerId: sellerId,
//           createdAt: { $gte: startDate },
//         },
//       },
//       {
//         $group: {
//           _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
//           orders: { $sum: 1 },
//           revenue: { $sum: "$totalAmount" },
//         },
//       },
//       { $sort: { _id: 1 } },
//     ]);

//     // Top products by sales
//     const topProducts = await Order.aggregate([
//       { $match: { sellerId: sellerId } },
//       { $unwind: "$products" },
//       {
//         $group: {
//           _id: "$products.productId",
//           totalSold: { $sum: "$products.quantity" },
//           totalRevenue: { $sum: "$products.total" },
//         },
//       },
//       { $sort: { totalSold: -1 } },
//       { $limit: 10 },
//       {
//         $lookup: {
//           from: "products",
//           localField: "_id",
//           foreignField: "_id",
//           as: "product",
//         },
//       },
//       { $unwind: "$product" },
//       {
//         $project: {
//           productName: "$product.name",
//           productImage: { $arrayElemAt: ["$product.images", 0] },
//           totalSold: 1,
//           totalRevenue: 1,
//         },
//       },
//     ]);

//     res.status(200).json({
//       success: true,
//       data: {
//         ordersOverTime,
//         topProducts,
//         summary: {
//           totalOrders: ordersOverTime.reduce((sum, d) => sum + d.orders, 0),
//           totalRevenue: ordersOverTime.reduce((sum, d) => sum + d.revenue, 0),
//         },
//       },
//     });
//   } catch (error) {
//     console.error("Get order analytics error:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
const OrderItem = require("../../models/OrderItem");
const Product = require("../../models/Product");
const { Earning } = require("../../models/seller/Earning");

// ==================== NOTE ====================
// Each "order" a seller sees here is actually one OrderItem: a single
// product-line within a customer's cart, scoped to this seller only.
// A single customer Order can contain items from multiple sellers, so
// sellers never see or touch another seller's items within that order.
// The `:id` in these routes refers to an OrderItem's _id, not the parent
// Order's _id.

// 📋 Get All Orders (order items belonging to this seller)
exports.getOrders = async (req, res) => {
  try {
    const sellerId = req.seller._id;
    const { page = 1, limit = 10, status, search } = req.query;

    const query = { sellerId };
    if (status) query.status = status;
    if (search) {
      query.productName = { $regex: search, $options: "i" };
    }

    const items = await OrderItem.find(query)
      .populate("order", "orderNumber shippingAddress paymentStatus paymentMethod createdAt")
      .populate("product", "name images")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await OrderItem.countDocuments(query);

    res.status(200).json({
      success: true,
      data: items,
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

// 🔍 Get Single Order (order item)
exports.getOrder = async (req, res) => {
  try {
    const item = await OrderItem.findOne({
      _id: req.params.id,
      sellerId: req.seller._id,
    })
      .populate("order", "orderNumber shippingAddress paymentStatus paymentMethod createdAt")
      .populate("product", "name images price");

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 📦 Update Order Status (this seller's item only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingNumber, courierName, notes } = req.body;

    const item = await OrderItem.findOne({
      _id: req.params.id,
      sellerId: req.seller._id,
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

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

    if (!validTransitions[item.status]?.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status transition from ${item.status} to ${status}`,
      });
    }

    item.status = status;
    if (trackingNumber) item.trackingNumber = trackingNumber;
    if (courierName) item.courierName = courierName;
    if (notes) item.notes = notes;

    if (status === "Delivered") {
      item.deliveredAt = new Date();

      const earning = new Earning({
        sellerId: item.sellerId,
        orderId: item.order,
        amount: item.subtotal,
        commission: item.commission || 0,
        netAmount: item.netEarning || item.subtotal - (item.commission || 0),
        status: "Pending",
        description: `Earning from order item ${item._id}`,
      });
      await earning.save();
    }

    if (status === "Cancelled") {
      item.cancelledAt = new Date();
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    }

    await item.save();

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      data: item,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 🚚 Update Tracking (this seller's item only)
exports.updateTracking = async (req, res) => {
  try {
    const { trackingNumber, courierName } = req.body;

    const item = await OrderItem.findOne({
      _id: req.params.id,
      sellerId: req.seller._id,
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    item.trackingNumber = trackingNumber || item.trackingNumber;
    item.courierName = courierName || item.courierName;
    await item.save();

    res.status(200).json({
      success: true,
      message: "Tracking updated successfully",
      data: item,
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

    const stats = await OrderItem.aggregate([
      { $match: { sellerId: sellerId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalAmount: { $sum: "$subtotal" },
        },
      },
    ]);

    const dailyStats = await OrderItem.aggregate([
      { $match: { sellerId: sellerId } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
          total: { $sum: "$subtotal" },
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