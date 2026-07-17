const User = require("../models/User");
const Order = require("../models/Order");

// ================= Get All Customers =================
// GET /api/customers
// Builds the shape Customers.jsx expects:
// { id, name, email, phone, city, status, totalSpent, orders, joinDate, customerType, rating }

exports.getAllCustomers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password");

    const customers = await Promise.all(
      users.map(async (user) => {
        const userOrders = await Order.find({ user: user._id });

        const totalSpent = userOrders
          .filter((o) => o.orderStatus === "delivered")
          .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

        const lastOrder = userOrders.sort(
          (a, b) => new Date(b.placedAt) - new Date(a.placedAt)
        )[0];

        const customerType =
          totalSpent > 10000 ? "VIP" : totalSpent > 3000 ? "Regular" : "New";

        return {
          id: user._id,
          name: user.fullName,
          email: user.email || user.username || "-",
          phone: user.phone || "-",
          city: lastOrder?.shippingAddress?.city || "-",
          status: user.isBlocked ? "inactive" : "active",
          totalSpent,
          orders: userOrders.length,
          joinDate: user.createdAt,
          customerType,
          rating: 4.5,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: customers.length,
      customers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= Get Single Customer =================
// GET /api/customers/:id

exports.getCustomerById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const userOrders = await Order.find({ user: user._id }).sort({
      placedAt: -1,
    });

    const totalSpent = userOrders
      .filter((o) => o.orderStatus === "delivered")
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    res.status(200).json({
      success: true,
      customer: {
        id: user._id,
        name: user.fullName,
        email: user.email || user.username || "-",
        phone: user.phone || "-",
        status: user.isBlocked ? "inactive" : "active",
        totalSpent,
        orders: userOrders,
        joinDate: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= Delete Customer =================
// DELETE /api/customers/:id

exports.deleteCustomer = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: "Customer deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};