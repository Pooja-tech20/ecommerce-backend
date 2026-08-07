const Seller = require("../../models/Seller");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Product = require("../../models/Product");
const Order = require("../../models/Order");
const { Earning } = require("../../models/Earning");

// 👤 Get Profile
exports.getProfile = async (req, res) => {
  try {
    const seller = await Seller.findById(req.seller._id).select("-password");
    
    res.status(200).json({
      success: true,
      data: seller,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✏️ Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    const allowedUpdates = [
      "shopName",
      "ownerName",
      "phone",
      "address",
      "logo",
      "gstNumber",
      "panNumber",
    ];
    
    // Filter only allowed fields
    const filteredUpdates = {};
    Object.keys(updates).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    });

    const seller = await Seller.findByIdAndUpdate(
      req.seller._id,
      { $set: filteredUpdates },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: seller,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 🔑 Change Password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    const seller = await Seller.findById(req.seller._id);
    
    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, seller.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    seller.password = await bcrypt.hash(newPassword, salt);
    await seller.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 🏪 Update Shop Settings
exports.updateShopSettings = async (req, res) => {
  try {
    const { 
      shopName, 
      logo, 
      description, 
      returnPolicy, 
      shippingPolicy,
      storeTimings 
    } = req.body;

    const seller = await Seller.findById(req.seller._id);
    
    seller.shopName = shopName || seller.shopName;
    seller.logo = logo || seller.logo;
    seller.shopDescription = description || seller.shopDescription;
    seller.returnPolicy = returnPolicy || seller.returnPolicy;
    seller.shippingPolicy = shippingPolicy || seller.shippingPolicy;
    seller.storeTimings = storeTimings || seller.storeTimings;
    
    await seller.save();

    res.status(200).json({
      success: true,
      message: "Shop settings updated successfully",
      data: seller,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 💳 Update Payment Settings
exports.updatePaymentSettings = async (req, res) => {
  try {
    const { 
      bankDetails, 
      upiId,
      paymentEmail 
    } = req.body;

    const seller = await Seller.findById(req.seller._id);
    
    seller.bankDetails = {
      accountNumber: bankDetails?.accountNumber || seller.bankDetails?.accountNumber || "",
      ifscCode: bankDetails?.ifscCode || seller.bankDetails?.ifscCode || "",
      accountHolder: bankDetails?.accountHolder || seller.bankDetails?.accountHolder || "",
      bankName: bankDetails?.bankName || seller.bankDetails?.bankName || "",
    };
    
    seller.upiId = upiId || seller.upiId || "";
    seller.paymentEmail = paymentEmail || seller.paymentEmail || "";
    
    await seller.save();

    res.status(200).json({
      success: true,
      message: "Payment settings updated successfully",
      data: {
        bankDetails: seller.bankDetails,
        upiId: seller.upiId,
        paymentEmail: seller.paymentEmail,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 📧 Update Notification Settings
exports.updateNotificationSettings = async (req, res) => {
  try {
    const { 
      emailNotifications, 
      smsNotifications,
      orderUpdates,
      paymentUpdates,
      marketingEmails 
    } = req.body;

    const seller = await Seller.findByIdAndUpdate(
      req.seller._id,
      {
        $set: {
          "notificationSettings.emailNotifications": emailNotifications !== undefined ? emailNotifications : true,
          "notificationSettings.smsNotifications": smsNotifications !== undefined ? smsNotifications : false,
          "notificationSettings.orderUpdates": orderUpdates !== undefined ? orderUpdates : true,
          "notificationSettings.paymentUpdates": paymentUpdates !== undefined ? paymentUpdates : true,
          "notificationSettings.marketingEmails": marketingEmails !== undefined ? marketingEmails : false,
        },
      },
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Notification settings updated",
      data: seller.notificationSettings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 📊 Seller Dashboard Stats
exports.getDashboardStats = async (req, res) => {
  try {
    const sellerId = req.seller._id;

    // Today's stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [todayOrders, totalStats, recentOrders, topProducts] = await Promise.all([
      // Today's orders
      Order.find({
        sellerId,
        createdAt: { $gte: today, $lt: tomorrow },
      }),
      
      // Total stats
      Order.aggregate([
        { $match: { sellerId } },
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalRevenue: { $sum: "$totalAmount" },
            pendingOrders: {
              $sum: { $cond: [{ $in: ["$status", ["Pending", "Confirmed", "Processing"]] }, 1, 0] },
            },
            deliveredOrders: {
              $sum: { $cond: [{ $eq: ["$status", "Delivered"] }, 1, 0] },
            },
          },
        },
      ]),
      
      // Recent orders
      Order.find({ sellerId })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("products.productId", "name images"),
      
      // Top products
      Product.find({ sellerId })
        .sort({ soldCount: -1 })
        .limit(5)
        .select("name price stock soldCount images"),
    ]);

    // Calculate today's revenue
    const todayRevenue = todayOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Get earnings summary
    const earnings = await Earning.aggregate([
      { $match: { sellerId, status: "Available" } },
      {
        $group: {
          _id: null,
          availableBalance: { $sum: "$netAmount" },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        today: {
          orders: todayOrders.length,
          revenue: todayRevenue,
        },
        total: totalStats[0] || {
          totalOrders: 0,
          totalRevenue: 0,
          pendingOrders: 0,
          deliveredOrders: 0,
        },
        availableBalance: earnings[0]?.availableBalance || 0,
        recentOrders,
        topProducts,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 📈 Get Seller Analytics
exports.getAnalytics = async (req, res) => {
  try {
    const sellerId = req.seller._id;
    const { days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Orders over time
    const ordersOverTime = await Order.aggregate([
      {
        $match: {
          sellerId,
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          orders: { $sum: 1 },
          revenue: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Category performance
    const categoryPerformance = await Product.aggregate([
      { $match: { sellerId } },
      {
        $lookup: {
          from: "orders",
          localField: "_id",
          foreignField: "products.productId",
          as: "orders",
        },
      },
      {
        $project: {
          category: 1,
          soldCount: 1,
          ordersCount: { $size: "$orders" },
        },
      },
      {
        $group: {
          _id: "$category",
          totalSold: { $sum: "$soldCount" },
          totalOrders: { $sum: "$ordersCount" },
          productCount: { $sum: 1 },
        },
      },
    ]);

    // Customer demographics (basic)
    const customerStats = await Order.aggregate([
      { $match: { sellerId } },
      {
        $group: {
          _id: null,
          uniqueCustomers: { $addToSet: "$customerId" },
          totalCustomers: { $sum: 1 },
        },
      },
      {
        $project: {
          uniqueCustomers: { $size: "$uniqueCustomers" },
          totalCustomers: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        ordersOverTime,
        categoryPerformance,
        customerStats: customerStats[0] || { uniqueCustomers: 0, totalCustomers: 0 },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 🚀 Upload Shop Logo
exports.uploadLogo = async (req, res) => {
  try {
    // Assuming you have multer or cloudinary set up
    const logoUrl = req.file?.path || req.body.logoUrl;
    
    if (!logoUrl) {
      return res.status(400).json({
        success: false,
        message: "Logo URL is required",
      });
    }

    const seller = await Seller.findByIdAndUpdate(
      req.seller._id,
      { logo: logoUrl },
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Logo uploaded successfully",
      data: { logo: seller.logo },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 🗑️ Delete Seller Account
exports.deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required to delete account",
      });
    }

    const seller = await Seller.findById(req.seller._id);
    
    const isMatch = await bcrypt.compare(password, seller.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    // Check for pending orders
    const pendingOrders = await Order.countDocuments({
      sellerId: req.seller._id,
      status: { $in: ["Pending", "Confirmed", "Processing"] },
    });

    if (pendingOrders > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete account. You have ${pendingOrders} pending orders.`,
      });
    }

    // Delete all seller data (optional: soft delete)
    await Seller.findByIdAndUpdate(req.seller._id, {
      isBlocked: true,
      status: "Rejected",
    });

    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};