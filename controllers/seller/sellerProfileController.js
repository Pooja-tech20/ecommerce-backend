// const Seller = require("../../models/seller/Seller");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const Product = require("../../models/Product");
// const Order = require("../../models/seller/Order");
// const { Earning } = require("../../models/seller/Earning");

// // 👤 Get Profile
// exports.getProfile = async (req, res) => {
//   try {
//     const seller = await Seller.findById(req.seller._id).select("-password");
    
//     res.status(200).json({
//       success: true,
//       data: seller,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ✏️ Update Profile
// exports.updateProfile = async (req, res) => {
//   try {
//     const updates = req.body;
//     const allowedUpdates = [
//       "shopName",
//       "ownerName",
//       "phone",
//       "address",
//       "logo",
//       "gstNumber",
//       "panNumber",
//     ];
    
//     // Filter only allowed fields
//     const filteredUpdates = {};
//     Object.keys(updates).forEach((key) => {
//       if (allowedUpdates.includes(key)) {
//         filteredUpdates[key] = updates[key];
//       }
//     });

//     const seller = await Seller.findByIdAndUpdate(
//       req.seller._id,
//       { $set: filteredUpdates },
//       { new: true, runValidators: true }
//     ).select("-password");

//     res.status(200).json({
//       success: true,
//       message: "Profile updated successfully",
//       data: seller,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // 🔑 Change Password
// exports.changePassword = async (req, res) => {
//   try {
//     const { currentPassword, newPassword } = req.body;

//     if (!currentPassword || !newPassword) {
//       return res.status(400).json({
//         success: false,
//         message: "Current password and new password are required",
//       });
//     }

//     const seller = await Seller.findById(req.seller._id);
    
//     // Verify current password
//     const isMatch = await bcrypt.compare(currentPassword, seller.password);
//     if (!isMatch) {
//       return res.status(401).json({
//         success: false,
//         message: "Current password is incorrect",
//       });
//     }

//     // Hash new password
//     const salt = await bcrypt.genSalt(10);
//     seller.password = await bcrypt.hash(newPassword, salt);
//     await seller.save();

//     res.status(200).json({
//       success: true,
//       message: "Password changed successfully",
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // 🏪 Update Shop Settings
// exports.updateShopSettings = async (req, res) => {
//   try {
//     const { 
//       shopName, 
//       logo, 
//       description, 
//       returnPolicy, 
//       shippingPolicy,
//       storeTimings 
//     } = req.body;

//     const seller = await Seller.findById(req.seller._id);
    
//     seller.shopName = shopName || seller.shopName;
//     seller.logo = logo || seller.logo;
//     seller.shopDescription = description || seller.shopDescription;
//     seller.returnPolicy = returnPolicy || seller.returnPolicy;
//     seller.shippingPolicy = shippingPolicy || seller.shippingPolicy;
//     seller.storeTimings = storeTimings || seller.storeTimings;
    
//     await seller.save();

//     res.status(200).json({
//       success: true,
//       message: "Shop settings updated successfully",
//       data: seller,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // 💳 Update Payment Settings
// exports.updatePaymentSettings = async (req, res) => {
//   try {
//     const { 
//       bankDetails, 
//       upiId,
//       paymentEmail 
//     } = req.body;

//     const seller = await Seller.findById(req.seller._id);
    
//     seller.bankDetails = {
//       accountNumber: bankDetails?.accountNumber || seller.bankDetails?.accountNumber || "",
//       ifscCode: bankDetails?.ifscCode || seller.bankDetails?.ifscCode || "",
//       accountHolder: bankDetails?.accountHolder || seller.bankDetails?.accountHolder || "",
//       bankName: bankDetails?.bankName || seller.bankDetails?.bankName || "",
//     };
    
//     seller.upiId = upiId || seller.upiId || "";
//     seller.paymentEmail = paymentEmail || seller.paymentEmail || "";
    
//     await seller.save();

//     res.status(200).json({
//       success: true,
//       message: "Payment settings updated successfully",
//       data: {
//         bankDetails: seller.bankDetails,
//         upiId: seller.upiId,
//         paymentEmail: seller.paymentEmail,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // 📧 Update Notification Settings
// exports.updateNotificationSettings = async (req, res) => {
//   try {
//     const { 
//       emailNotifications, 
//       smsNotifications,
//       orderUpdates,
//       paymentUpdates,
//       marketingEmails 
//     } = req.body;

//     const seller = await Seller.findByIdAndUpdate(
//       req.seller._id,
//       {
//         $set: {
//           "notificationSettings.emailNotifications": emailNotifications !== undefined ? emailNotifications : true,
//           "notificationSettings.smsNotifications": smsNotifications !== undefined ? smsNotifications : false,
//           "notificationSettings.orderUpdates": orderUpdates !== undefined ? orderUpdates : true,
//           "notificationSettings.paymentUpdates": paymentUpdates !== undefined ? paymentUpdates : true,
//           "notificationSettings.marketingEmails": marketingEmails !== undefined ? marketingEmails : false,
//         },
//       },
//       { new: true }
//     ).select("-password");

//     res.status(200).json({
//       success: true,
//       message: "Notification settings updated",
//       data: seller.notificationSettings,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // 📊 Seller Dashboard Stats
// exports.getDashboardStats = async (req, res) => {
//   try {
//     const sellerId = req.seller._id;

//     // Today's stats
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const tomorrow = new Date(today);
//     tomorrow.setDate(tomorrow.getDate() + 1);

//     const [todayOrders, totalStats, recentOrders, topProducts] = await Promise.all([
//       // Today's orders
//       Order.find({
//         sellerId,
//         createdAt: { $gte: today, $lt: tomorrow },
//       }),
      
//       // Total stats
//       Order.aggregate([
//         { $match: { sellerId } },
//         {
//           $group: {
//             _id: null,
//             totalOrders: { $sum: 1 },
//             totalRevenue: { $sum: "$totalAmount" },
//             pendingOrders: {
//               $sum: { $cond: [{ $in: ["$status", ["Pending", "Confirmed", "Processing"]] }, 1, 0] },
//             },
//             deliveredOrders: {
//               $sum: { $cond: [{ $eq: ["$status", "Delivered"] }, 1, 0] },
//             },
//           },
//         },
//       ]),
      
//       // Recent orders
//       Order.find({ sellerId })
//         .sort({ createdAt: -1 })
//         .limit(5)
//         .populate("products.productId", "name images"),
      
//       // Top products
//       Product.find({ sellerId })
//         .sort({ soldCount: -1 })
//         .limit(5)
//         .select("name price stock soldCount images"),
//     ]);

//     // Calculate today's revenue
//     const todayRevenue = todayOrders.reduce((sum, order) => sum + order.totalAmount, 0);

//     // Get earnings summary
//     const earnings = await Earning.aggregate([
//       { $match: { sellerId, status: "Available" } },
//       {
//         $group: {
//           _id: null,
//           availableBalance: { $sum: "$netAmount" },
//         },
//       },
//     ]);

//     res.status(200).json({
//       success: true,
//       data: {
//         today: {
//           orders: todayOrders.length,
//           revenue: todayRevenue,
//         },
//         total: totalStats[0] || {
//           totalOrders: 0,
//           totalRevenue: 0,
//           pendingOrders: 0,
//           deliveredOrders: 0,
//         },
//         availableBalance: earnings[0]?.availableBalance || 0,
//         recentOrders,
//         topProducts,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // 📈 Get Seller Analytics
// exports.getAnalytics = async (req, res) => {
//   try {
//     const sellerId = req.seller._id;
//     const { days = 30 } = req.query;

//     const startDate = new Date();
//     startDate.setDate(startDate.getDate() - parseInt(days));

//     // Orders over time
//     const ordersOverTime = await Order.aggregate([
//       {
//         $match: {
//           sellerId,
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

//     // Category performance
//     const categoryPerformance = await Product.aggregate([
//       { $match: { sellerId } },
//       {
//         $lookup: {
//           from: "orders",
//           localField: "_id",
//           foreignField: "products.productId",
//           as: "orders",
//         },
//       },
//       {
//         $project: {
//           category: 1,
//           soldCount: 1,
//           ordersCount: { $size: "$orders" },
//         },
//       },
//       {
//         $group: {
//           _id: "$category",
//           totalSold: { $sum: "$soldCount" },
//           totalOrders: { $sum: "$ordersCount" },
//           productCount: { $sum: 1 },
//         },
//       },
//     ]);

//     // Customer demographics (basic)
//     const customerStats = await Order.aggregate([
//       { $match: { sellerId } },
//       {
//         $group: {
//           _id: null,
//           uniqueCustomers: { $addToSet: "$customerId" },
//           totalCustomers: { $sum: 1 },
//         },
//       },
//       {
//         $project: {
//           uniqueCustomers: { $size: "$uniqueCustomers" },
//           totalCustomers: 1,
//         },
//       },
//     ]);

//     res.status(200).json({
//       success: true,
//       data: {
//         ordersOverTime,
//         categoryPerformance,
//         customerStats: customerStats[0] || { uniqueCustomers: 0, totalCustomers: 0 },
//       },
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // 🚀 Upload Shop Logo
// exports.uploadLogo = async (req, res) => {
//   try {
//     // Assuming you have multer or cloudinary set up
//     const logoUrl = req.file?.path || req.body.logoUrl;
    
//     if (!logoUrl) {
//       return res.status(400).json({
//         success: false,
//         message: "Logo URL is required",
//       });
//     }

//     const seller = await Seller.findByIdAndUpdate(
//       req.seller._id,
//       { logo: logoUrl },
//       { new: true }
//     ).select("-password");

//     res.status(200).json({
//       success: true,
//       message: "Logo uploaded successfully",
//       data: { logo: seller.logo },
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // 🗑️ Delete Seller Account
// exports.deleteAccount = async (req, res) => {
//   try {
//     const { password } = req.body;
    
//     if (!password) {
//       return res.status(400).json({
//         success: false,
//         message: "Password is required to delete account",
//       });
//     }

//     const seller = await Seller.findById(req.seller._id);
    
//     const isMatch = await bcrypt.compare(password, seller.password);
//     if (!isMatch) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid password",
//       });
//     }

//     // Check for pending orders
//     const pendingOrders = await Order.countDocuments({
//       sellerId: req.seller._id,
//       status: { $in: ["Pending", "Confirmed", "Processing"] },
//     });

//     if (pendingOrders > 0) {
//       return res.status(400).json({
//         success: false,
//         message: `Cannot delete account. You have ${pendingOrders} pending orders.`,
//       });
//     }

//     // Delete all seller data (optional: soft delete)
//     await Seller.findByIdAndUpdate(req.seller._id, {
//       isBlocked: true,
//       status: "Rejected",
//     });

//     res.status(200).json({
//       success: true,
//       message: "Account deleted successfully",
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

const Seller = require("../../models/seller/Seller");
const Product = require("../../models/Product");
const Order = require("../../models/seller/Order");
const OrderItem = require("../../models/OrderItem");
const { Earning } = require("../../models/seller/Earning");
const Review = require("../../models/seller/Review");
const bcrypt = require("bcryptjs");

// ============================================================
// GET PROFILE
// ============================================================
exports.getProfile = async (req, res) => {
  try {
    const seller = await Seller.findById(req.seller._id).select("-password");
    if (!seller) {
      return res.status(404).json({ success: false, message: "Seller not found" });
    }
    res.status(200).json({ success: true, data: seller });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================================
// UPDATE PROFILE
// ============================================================
exports.updateProfile = async (req, res) => {
  try {
    const seller = await Seller.findById(req.seller._id);
    if (!seller) {
      return res.status(404).json({ success: false, message: "Seller not found" });
    }

    const allowedUpdates = ["shopName", "ownerName", "phone", "address", "gstNumber", "panNumber", "logo", "shopDescription"];
    let updated = false;
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        seller[field] = req.body[field];
        updated = true;
      }
    });

    if (!updated) {
      return res.status(400).json({ success: false, message: "No valid fields to update" });
    }

    await seller.save();
    res.status(200).json({ success: true, message: "Profile updated successfully", data: seller });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================================
// CHANGE PASSWORD
// ============================================================
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Current password and new password are required" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "New password must be at least 6 characters" });
    }

    const seller = await Seller.findById(req.seller._id);
    const isMatch = await bcrypt.compare(currentPassword, seller.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Current password is incorrect" });
    }

    seller.password = await bcrypt.hash(newPassword, 10);
    await seller.save();
    res.status(200).json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================================
// UPDATE SHOP SETTINGS
// ============================================================
exports.updateShopSettings = async (req, res) => {
  try {
    const { shopName, logo, description, returnPolicy, shippingPolicy, storeTimings } = req.body;
    const seller = await Seller.findById(req.seller._id);
    if (!seller) {
      return res.status(404).json({ success: false, message: "Seller not found" });
    }

    if (shopName) seller.shopName = shopName;
    if (logo) seller.logo = logo;
    if (description) seller.shopDescription = description;
    if (returnPolicy) seller.returnPolicy = returnPolicy;
    if (shippingPolicy) seller.shippingPolicy = shippingPolicy;
    if (storeTimings) seller.storeTimings = storeTimings;

    await seller.save();
    res.status(200).json({ success: true, message: "Shop settings updated successfully", data: seller });
  } catch (error) {
    console.error("Update shop settings error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================================
// UPDATE PAYMENT SETTINGS
// ============================================================
exports.updatePaymentSettings = async (req, res) => {
  try {
    const { bankDetails, upiId, paymentEmail } = req.body;
    const seller = await Seller.findById(req.seller._id);
    if (!seller) {
      return res.status(404).json({ success: false, message: "Seller not found" });
    }

    if (bankDetails) {
      seller.bankDetails = {
        accountNumber: bankDetails.accountNumber || seller.bankDetails?.accountNumber || "",
        ifscCode: bankDetails.ifscCode || seller.bankDetails?.ifscCode || "",
        accountHolder: bankDetails.accountHolder || seller.bankDetails?.accountHolder || "",
        bankName: bankDetails.bankName || seller.bankDetails?.bankName || "",
      };
    }
    if (upiId) seller.upiId = upiId;
    if (paymentEmail) seller.paymentEmail = paymentEmail;

    await seller.save();
    res.status(200).json({ success: true, message: "Payment settings updated successfully", data: seller });
  } catch (error) {
    console.error("Update payment settings error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================================
// UPDATE NOTIFICATION SETTINGS
// ============================================================
exports.updateNotificationSettings = async (req, res) => {
  try {
    const { emailNotifications, smsNotifications, orderUpdates, paymentUpdates, marketingEmails } = req.body;
    const seller = await Seller.findById(req.seller._id);
    if (!seller) {
      return res.status(404).json({ success: false, message: "Seller not found" });
    }

    seller.notificationSettings = {
      emailNotifications: emailNotifications !== undefined ? emailNotifications : seller.notificationSettings?.emailNotifications || true,
      smsNotifications: smsNotifications !== undefined ? smsNotifications : seller.notificationSettings?.smsNotifications || false,
      orderUpdates: orderUpdates !== undefined ? orderUpdates : seller.notificationSettings?.orderUpdates || true,
      paymentUpdates: paymentUpdates !== undefined ? paymentUpdates : seller.notificationSettings?.paymentUpdates || true,
      marketingEmails: marketingEmails !== undefined ? marketingEmails : seller.notificationSettings?.marketingEmails || false,
    };

    await seller.save();
    res.status(200).json({ success: true, message: "Notification settings updated successfully", data: seller });
  } catch (error) {
    console.error("Update notification settings error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================================
// UPLOAD LOGO
// ============================================================
exports.uploadLogo = async (req, res) => {
  try {
    const { logoUrl } = req.body;
    if (!logoUrl) {
      return res.status(400).json({ success: false, message: "Logo URL is required" });
    }

    const seller = await Seller.findByIdAndUpdate(req.seller._id, { logo: logoUrl }, { new: true }).select("-password");
    res.status(200).json({ success: true, message: "Logo uploaded successfully", data: { logo: seller.logo } });
  } catch (error) {
    console.error("Upload logo error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================================
// GET DASHBOARD STATS
// ============================================================
exports.getDashboardStats = async (req, res) => {
  try {
    const sellerId = req.seller._id;

    // Get all order items for this seller
    const orderItems = await OrderItem.find({ sellerId });
    const orderIds = [...new Set(orderItems.map(item => item.order.toString()))];

    // Today's stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayOrders = await Order.countDocuments({
      _id: { $in: orderIds },
      createdAt: { $gte: today, $lt: tomorrow },
    });

    const todayRevenue = await Order.aggregate([
      { $match: { _id: { $in: orderIds }, createdAt: { $gte: today, $lt: tomorrow } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    // Total stats
    const totalOrders = await Order.countDocuments({ _id: { $in: orderIds } });
    const totalRevenue = await Order.aggregate([
      { $match: { _id: { $in: orderIds } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    const pendingOrders = await Order.countDocuments({
      _id: { $in: orderIds },
      orderStatus: { $in: ["pending", "confirmed", "packed"] },
    });

    const earnings = await Earning.aggregate([
      { $match: { sellerId: sellerId, status: "Available" } },
      { $group: { _id: null, total: { $sum: "$netAmount" } } },
    ]);

    const topProducts = await OrderItem.aggregate([
      { $match: { sellerId: sellerId } },
      {
        $group: {
          _id: "$product",
          totalSold: { $sum: "$quantity" },
          totalRevenue: { $sum: "$subtotal" },
          productName: { $first: "$productName" },
          productImage: { $first: "$productImage" },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
    ]);

    const recentOrders = await Order.find({ _id: { $in: orderIds } })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "fullName");

    const totalProducts = await Product.countDocuments({ sellerId });
    const lowStockProducts = await Product.countDocuments({ sellerId: sellerId, stock: { $lt: 10 } });

    const recentReviews = await Review.find({ sellerId: sellerId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "fullName")
      .populate("product", "name");

    res.status(200).json({
      success: true,
      data: {
        today: {
          orders: todayOrders,
          revenue: todayRevenue[0]?.total || 0,
        },
        total: {
          orders: totalOrders,
          revenue: totalRevenue[0]?.total || 0,
          products: totalProducts,
          pendingOrders: pendingOrders,
          lowStockProducts: lowStockProducts,
        },
        availableBalance: earnings[0]?.total || 0,
        topProducts,
        recentOrders: recentOrders.map(order => ({
          _id: order._id,
          orderNumber: order.orderNumber,
          totalAmount: order.totalAmount,
          orderStatus: order.orderStatus,
          customer: order.user?.fullName || "Unknown",
          createdAt: order.createdAt,
        })),
        recentReviews: recentReviews.map(review => ({
          _id: review._id,
          rating: review.rating,
          comment: review.comment,
          productName: review.product?.name || "Unknown",
          customer: review.user?.fullName || "Unknown",
          createdAt: review.createdAt,
        })),
      },
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================================
// GET ANALYTICS
// ============================================================
exports.getAnalytics = async (req, res) => {
  try {
    const sellerId = req.seller._id;
    const { days = 30 } = req.query;

    const orderItems = await OrderItem.find({ sellerId });
    const orderIds = [...new Set(orderItems.map(item => item.order.toString()))];

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const ordersOverTime = await Order.aggregate([
      { $match: { _id: { $in: orderIds }, createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          orders: { $sum: 1 },
          revenue: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const categorySales = await OrderItem.aggregate([
      { $match: { sellerId: sellerId } },
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "productData",
        },
      },
      { $unwind: "$productData" },
      {
        $group: {
          _id: "$productData.category",
          totalSold: { $sum: "$quantity" },
          totalRevenue: { $sum: "$subtotal" },
        },
      },
      { $sort: { totalRevenue: -1 } },
    ]);

    const earningsTrend = await Earning.aggregate([
      { $match: { sellerId: sellerId } },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          total: { $sum: "$netAmount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 12 },
    ]);

    const customerStats = await Order.aggregate([
      { $match: { _id: { $in: orderIds } } },
      {
        $group: {
          _id: "$user",
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: "$totalAmount" },
        },
      },
      {
        $group: {
          _id: null,
          uniqueCustomers: { $sum: 1 },
          totalOrders: { $sum: "$totalOrders" },
          totalSpent: { $sum: "$totalSpent" },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        ordersOverTime,
        categorySales,
        earningsTrend,
        customerStats: customerStats[0] || { uniqueCustomers: 0, totalOrders: 0, totalSpent: 0 },
        summary: {
          totalOrders: ordersOverTime.reduce((sum, d) => sum + d.orders, 0),
          totalRevenue: ordersOverTime.reduce((sum, d) => sum + d.revenue, 0),
        },
      },
    });
  } catch (error) {
    console.error("Get analytics error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================================
// DELETE ACCOUNT
// ============================================================
exports.deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ success: false, message: "Password is required to delete account" });
    }

    const seller = await Seller.findById(req.seller._id);
    const isMatch = await bcrypt.compare(password, seller.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }

    const orderItems = await OrderItem.find({ sellerId: req.seller._id });
    const orderIds = [...new Set(orderItems.map(item => item.order.toString()))];

    const pendingOrders = await Order.countDocuments({
      _id: { $in: orderIds },
      orderStatus: { $in: ["pending", "confirmed", "packed", "shipped", "out_for_delivery"] },
    });

    if (pendingOrders > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete account. You have ${pendingOrders} pending orders.`,
      });
    }

    await Seller.findByIdAndUpdate(req.seller._id, { isBlocked: true, status: "Rejected" });
    res.status(200).json({ success: true, message: "Account deleted successfully" });
  } catch (error) {
    console.error("Delete account error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};