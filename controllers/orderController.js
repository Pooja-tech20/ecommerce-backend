const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Product = require("../models/Product");
const Notification = require("../models/Notification");

// ================================
// Generate Order Number
// ================================
const generateOrderNumber = async () => {
  const count = await Order.countDocuments();
  return "ORD" + String(10001 + count);
};

// ================================
// Create Order
// ================================
const createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      discount,
      deliveryFee,
      tax,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order items are required",
      });
    }

    let subtotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `${product.name} is out of stock`,
        });
      }

      subtotal += product.price * item.quantity;
    }

    const totalAmount =
      subtotal -
      (discount || 0) +
      (deliveryFee || 0) +
      (tax || 0);

    const order = await Order.create({
      orderNumber: await generateOrderNumber(),
      user: req.user._id,
      shippingAddress,
      subtotal,
      discount: discount || 0,
      deliveryFee: deliveryFee || 0,
      tax: tax || 0,
      totalAmount,
      paymentMethod,
    });
    await Notification.create({
    user: req.user._id,
    title: "Order Placed",
    message: `Your order ${order.orderNumber} has been placed successfully.`,
    type: "order",
});

    for (const item of items) {
      const product = await Product.findById(item.product);

      await OrderItem.create({
        order: order._id,
        product: product._id,
        productName: product.name,
        productImage: product.image,
        quantity: item.quantity,
        price: product.price,
        subtotal: product.price * item.quantity,
      });

      product.stock -= item.quantity;
      await product.save();
    }

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================================
// Get My Orders
// ================================
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================================
// Get Order By ID
// ================================
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "fullName phone");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const items = await OrderItem.find({
      order: order._id,
    });

    res.status(200).json({
      success: true,
      order,
      items,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================================
// Get All Orders
// ================================
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "fullName phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================================
// Update Order Status
// ================================
const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.orderStatus = orderStatus;

    if (orderStatus === "delivered") {
      order.deliveredAt = new Date();
      order.paymentStatus = "paid";
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated",
      order,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================================
// Cancel Order
// ================================
const cancelOrder = async (req, res) => {
  try {

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.orderStatus === "delivered") {
      return res.status(400).json({
        success: false,
        message: "Delivered order cannot be cancelled",
      });
    }

    const items = await OrderItem.find({
      order: order._id,
    });

    for (const item of items) {
      const product = await Product.findById(item.product);

      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    order.orderStatus = "cancelled";

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
};