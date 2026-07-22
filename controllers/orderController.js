/*const Order = require("../models/Order");
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

  // ==========================
  // Shipping Tracking
  // ==========================
  tracking: {
    status: "Order Placed",

    currentLocation: "Warehouse",

    estimatedDelivery: new Date(
      Date.now() + 3 * 24 * 60 * 60 * 1000
    ),

    trackingHistory: [
      {
        status: "Order Placed",
        location: "Warehouse",
        time: new Date(),
      },
    ],
  },
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
  order: {
    orderNumber: order.orderNumber,
    shippingAddress: order.shippingAddress,
    subtotal: order.subtotal,
    discount: order.discount,
    deliveryFee: order.deliveryFee,
    tax: order.tax,
    totalAmount: order.totalAmount,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    orderStatus: order.orderStatus,
    tracking: order.tracking,
    placedAt: order.placedAt,
  },
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
    const orders = await OrderItem.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    const formattedOrders = await Promise.all(
      orders.map(async (order) => 

         items = await OrderItem.find({

        

<<<<<<< HEAD
=======
        const items = await OrderItem.find({
>>>>>>> a4f2c254af720770c5c02b9e0902737b3e8a888b
          order: order._id,
        

        return :{
          orderNumber: order.orderNumber,
          totalAmount: order.totalAmount,
          paymentMethod: order.paymentMethod,
          paymentStatus: order.paymentStatus,
          orderStatus: order.orderStatus,
          tracking: order.tracking,
          placedAt: order.placedAt,

          itemCount: items.length,

          items: items.map((item) => ({
            productName: item.productName,
            productImage: item.productImage,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.subtotal,
          })),
        },
      })
    ));

    res.status(200).json({
      success: true,
      count: formattedOrders.length,
      orders: formattedOrders,
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

if (!order.tracking) {
  return res.status(200).json({
    success: true,
    message: "Tracking not available yet",
    tracking: null,
  });
}

const items = await OrderItem.find({
  order: order._id,
});

const formattedItems = items.map(item => ({
  productName: item.productName,
  productImage: item.productImage,
  quantity: item.quantity,
  price: item.price,
  subtotal: item.subtotal,
}));

res.status(200).json({
  success: true,
  order: {
    orderNumber: order.orderNumber,
    shippingAddress: order.shippingAddress,
    subtotal: order.subtotal,
    discount: order.discount,
    deliveryFee: order.deliveryFee,
    tax: order.tax,
    totalAmount: order.totalAmount,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    orderStatus: order.orderStatus,
    tracking: order.tracking,
    placedAt: order.placedAt,
  },
  items: formattedItems,
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

<<<<<<< HEAD
   const formattedOrders = orders.map(order => ({
      
  orderNumber: order.orderNumber,
  customer: order.user.fullName,
  phone: order.user.phone,
  totalAmount: order.totalAmount,
  paymentStatus: order.paymentStatus,
  orderStatus: order.orderStatus,
  tracking: order.tracking,
  placedAt: order.placedAt,
      
}));
=======
   const formattedOrders = await Promise.all(
  orders.map(async (order) => {

    const items = await OrderItem.find({
      order: order._id,
    });

    return {
      orderNumber: order.orderNumber,
      customer: order.user.fullName,
      phone: order.user.phone,
      totalAmount: order.totalAmount,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      tracking: order.tracking,
      placedAt: order.placedAt,

      items: items.map(item => ({
        productName: item.productName,
        productImage: item.productImage,
        quantity: item.quantity,
        price: item.price,
      })),
    };
>>>>>>> a4f2c254af720770c5c02b9e0902737b3e8a888b

  })
);
res.status(200).json({
  success: true,
  count: formattedOrders.length,
  orders: formattedOrders,
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
    // =========================
// Create tracking if missing
// =========================
if (!order.tracking) {
  order.tracking = {
    status: "Order Placed",
    currentLocation: "Warehouse",
    estimatedDelivery: new Date(
      Date.now() + 3 * 24 * 60 * 60 * 1000
    ),
    trackingHistory: [],
  };
}

  order.orderStatus = orderStatus;


// ================= Tracking Update =================

const locationMap = {
  confirmed: "Warehouse",
  packed: "Warehouse",
  shipped: "City Warehouse",
  out_for_delivery: "Local Delivery Hub",
  delivered: "Customer Address",
  cancelled: "Cancelled",
};

const statusMap = {
  confirmed: "Confirmed",
  packed: "Packed",
  shipped: "Shipped",
  out_for_delivery: "Out For Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

order.orderStatus = orderStatus;

order.tracking.status = statusMap[orderStatus];

order.tracking.currentLocation = locationMap[orderStatus];

order.tracking.trackingHistory.push({
  status: statusMap[orderStatus],
  location: locationMap[orderStatus],
  time: new Date(),
});

if (orderStatus === "delivered") {
  order.deliveredAt = new Date();
  order.paymentStatus = "paid";
}

await order.save();

  


   res.status(200).json({
  success: true,
  message: "Order status updated",
  order: {
    orderNumber: order.orderNumber,
    orderStatus: order.orderStatus,
    paymentStatus: order.paymentStatus,
    tracking: order.tracking,
  },
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
    // =========================
// Create tracking if missing
// =========================
if (!order.tracking) {
  order.tracking = {
    status: "Order Placed",
    currentLocation: "Warehouse",
    estimatedDelivery: new Date(
      Date.now() + 3 * 24 * 60 * 60 * 1000
    ),
    trackingHistory: [],
  };
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
  
order.tracking.status = "Cancelled";
order.tracking.currentLocation = "Cancelled";

if (!order.tracking.trackingHistory) {
  order.tracking.trackingHistory = [];
}

order.tracking.trackingHistory.push({
  status: "Cancelled",
  location: "Cancelled",
  time: new Date(),
});
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
// ======================================
// Track Order
// ======================================

const trackOrder = async (req, res) => {
  try {

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
  success: true,
  orderNumber: order.orderNumber,
  tracking: order.tracking,
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
  trackOrder,
};
*/

const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Product = require("../models/Product");
const Notification = require("../models/Notification");

// ================================
// Generate Order Number
// ================================
const generateOrderNumber = async () => {
  const count = await Order.countDocuments();
  return `ORD${String(10001 + count)}`;
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
      discount = 0,
      deliveryFee = 0,
      tax = 0,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order items are required",
      });
    }

    // Batch fetch all requested products to avoid N+1 database hits
    const productIds = items.map((item) => item.product);
    const products = await Product.find({ _id: { $in: productIds } });
    const productMap = new Map(products.map((p) => [p._id.toString(), p]));

    let subtotal = 0;

    // Validate stock and calculate subtotal
    for (const item of items) {
      const product = productMap.get(item.product.toString());

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.product}`,
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

    const totalAmount = subtotal - discount + deliveryFee + tax;
    const orderNumber = await generateOrderNumber();

    // Create Order document
    const order = await Order.create({
      orderNumber,
      user: req.user._id,
      shippingAddress,
      subtotal,
      discount,
      deliveryFee,
      tax,
      totalAmount,
      paymentMethod,
      tracking: {
        status: "Order Placed",
        currentLocation: "Warehouse",
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        trackingHistory: [
          {
            status: "Order Placed",
            location: "Warehouse",
            time: new Date(),
          },
        ],
      },
    });

    // Create Notification
    await Notification.create({
      user: req.user._id,
      title: "Order Placed",
      message: `Your order ${order.orderNumber} has been placed successfully.`,
      type: "order",
    });

    // Prepare order items & bulk operations for stock updates
    const orderItemsToInsert = [];
    const bulkStockUpdates = [];

    for (const item of items) {
      const product = productMap.get(item.product.toString());

      orderItemsToInsert.push({
        order: order._id,
        product: product._id,
        productName: product.name,
        productImage: product.image,
        quantity: item.quantity,
        price: product.price,
        subtotal: product.price * item.quantity,
      });

      bulkStockUpdates.push({
        updateOne: {
          filter: { _id: product._id },
          update: { $inc: { stock: -item.quantity } },
        },
      });
    }

    await OrderItem.insertMany(orderItemsToInsert);
    await Product.bulkWrite(bulkStockUpdates);

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: {
        orderNumber: order.orderNumber,
        shippingAddress: order.shippingAddress,
        subtotal: order.subtotal,
        discount: order.discount,
        deliveryFee: order.deliveryFee,
        tax: order.tax,
        totalAmount: order.totalAmount,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        tracking: order.tracking,
        placedAt: order.placedAt,
      },
    });
  } catch (error) {
    return res.status(500).json({
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

    const formattedOrders = await Promise.all(
      orders.map(async (order) => {

        const items = await OrderItem.find({
          order: order._id,
        });

        return {

          _id: order._id,
          orderNumber: order.orderNumber,
          totalAmount: order.totalAmount,
          paymentMethod: order.paymentMethod,
          paymentStatus: order.paymentStatus,
          orderStatus: order.orderStatus,
          tracking: order.tracking,
          placedAt: order.placedAt,

          itemCount: items.length,

          items: items.map(item => ({
            productName: item.productName,
            productImage: item.productImage,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.subtotal,
          })),
        };
      })
    );

    res.status(200).json({
      success: true,
      count: formattedOrders.length,
      orders: formattedOrders,
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
    const order = await Order.findById(req.params.id).populate("user", "fullName phone");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (!order.tracking) {
      return res.status(200).json({
        success: true,
        message: "Tracking not available yet",
        tracking: null,
      });
    }

    const items = await OrderItem.find({ order: order._id }).populate("product", "name image price");

    const formattedItems = items.map((item) => ({
      productName: item.productName,
      productImage: item.productImage,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.subtotal,
    }));

    return res.status(200).json({
      success: true,
      order: {
        orderNumber: order.orderNumber,
        shippingAddress: order.shippingAddress,
        subtotal: order.subtotal,
        discount: order.discount,
        deliveryFee: order.deliveryFee,
        tax: order.tax,
        totalAmount: order.totalAmount,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        tracking: order.tracking,
        placedAt: order.placedAt,
      },
      items: formattedItems,
    });
  } catch (error) {
    return res.status(500).json({
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

    const formattedOrders = orders.map((order) => ({
      orderNumber: order.orderNumber,
      customer: order.user?.fullName,
      phone: order.user?.phone,
      totalAmount: order.totalAmount,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      tracking: order.tracking,
      placedAt: order.placedAt,
    }));

    return res.status(200).json({
      success: true,
      count: formattedOrders.length,
      orders: formattedOrders,
    });
  } catch (error) {
    return res.status(500).json({
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

    if (!order.tracking) {
      order.tracking = {
        status: "Order Placed",
        currentLocation: "Warehouse",
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        trackingHistory: [],
      };
    }

    const locationMap = {
      confirmed: "Warehouse",
      packed: "Warehouse",
      shipped: "City Warehouse",
      out_for_delivery: "Local Delivery Hub",
      delivered: "Customer Address",
      cancelled: "Cancelled",
    };

    const statusMap = {
      confirmed: "Confirmed",
      packed: "Packed",
      shipped: "Shipped",
      out_for_delivery: "Out For Delivery",
      delivered: "Delivered",
      cancelled: "Cancelled",
    };

    order.orderStatus = orderStatus;
    order.tracking.status = statusMap[orderStatus] || orderStatus;
    order.tracking.currentLocation = locationMap[orderStatus] || "Warehouse";

    if (!order.tracking.trackingHistory) {
      order.tracking.trackingHistory = [];
    }

    order.tracking.trackingHistory.push({
      status: statusMap[orderStatus] || orderStatus,
      location: locationMap[orderStatus] || "Warehouse",
      time: new Date(),
    });

    if (orderStatus === "delivered") {
      order.deliveredAt = new Date();
      order.paymentStatus = "paid";
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated",
      order: {
        orderNumber: order.orderNumber,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        tracking: order.tracking,
      },
    });
  } catch (error) {
    return res.status(500).json({
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

    if (!order.tracking) {
      order.tracking = {
        status: "Order Placed",
        currentLocation: "Warehouse",
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        trackingHistory: [],
      };
    }

    const items = await OrderItem.find({ order: order._id });

    // Restock items in bulk
    const bulkStockRestock = items.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { stock: item.quantity } },
      },
    }));

    if (bulkStockRestock.length > 0) {
      await Product.bulkWrite(bulkStockRestock);
    }

    order.orderStatus = "cancelled";
    order.tracking.status = "Cancelled";
    order.tracking.currentLocation = "Cancelled";

    if (!order.tracking.trackingHistory) {
      order.tracking.trackingHistory = [];
    }

    order.tracking.trackingHistory.push({
      status: "Cancelled",
      location: "Cancelled",
      time: new Date(),
    });

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================================
// Track Order
// ================================
const trackOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      orderNumber: order.orderNumber,
      tracking: order.tracking,
    });
  } catch (error) {
    return res.status(500).json({
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
  trackOrder,

};

