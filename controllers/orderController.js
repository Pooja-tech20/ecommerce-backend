// // const Order = require("../models/Order");
// // const OrderItem = require("../models/OrderItem");
// // const Product = require("../models/Product");
// // const Notification = require("../models/Notification");

// // // ================================
// // // Generate Order Number
// // // ================================
// // const generateOrderNumber = async () => {
// //   const count = await Order.countDocuments();
// //   return `ORD${String(10001 + count)}`;
// // };

// // // ================================
// // // Create Order
// // // ================================
// // const createOrder = async (req, res) => {
// //   try {
// //     const {
// //       items,
// //       shippingAddress,
// //       paymentMethod,
// //       discount = 0,
// //       deliveryFee = 0,
// //       tax = 0,
// //     } = req.body;

// //     if (!items || items.length === 0) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Order items are required",
// //       });
// //     }

// //     // Batch fetch all requested products to avoid N+1 database hits
// //     const productIds = items.map((item) => item.product);
// //     const products = await Product.find({ _id: { $in: productIds } });
// //     const productMap = new Map(products.map((p) => [p._id.toString(), p]));

// //     let subtotal = 0;

// //     // Validate stock and calculate subtotal
// //     for (const item of items) {
// //       const product = productMap.get(item.product.toString());

// //       if (!product) {
// //         return res.status(404).json({
// //           success: false,
// //           message: `Product not found: ${item.product}`,
// //         });
// //       }

// //       if (product.stock < item.quantity) {
// //         return res.status(400).json({
// //           success: false,
// //           message: `${product.name} is out of stock`,
// //         });
// //       }

// //       subtotal += product.price * item.quantity;
// //     }

// //     const totalAmount = subtotal - discount + deliveryFee + tax;
// //     const orderNumber = await generateOrderNumber();

// //     // Create Order document
// //     const order = await Order.create({
// //       orderNumber,
// //       user: req.user._id,
// //       shippingAddress,
// //       subtotal,
// //       discount,
// //       deliveryFee,
// //       tax,
// //       totalAmount,
// //       paymentMethod,
// //       tracking: {
// //         status: "Order Placed",
// //         currentLocation: "Warehouse",
// //         estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
// //         trackingHistory: [
// //           {
// //             status: "Order Placed",
// //             location: "Warehouse",
// //             time: new Date(),
// //           },
// //         ],
// //       },
// //     });

// //     // Create Notification
// //     await Notification.create({
// //       user: req.user._id,
// //       title: "Order Placed",
// //       message: `Your order ${order.orderNumber} has been placed successfully.`,
// //       type: "order",
// //     });

// //     // Prepare order items & bulk operations for stock updates
// //     const orderItemsToInsert = [];
// //     const bulkStockUpdates = [];

// //     for (const item of items) {
// //       const product = productMap.get(item.product.toString());

// //       orderItemsToInsert.push({
// //         order: order._id,
// //         product: product._id,
// //         productName: product.name,
// //         productImage: product.image,
// //         quantity: item.quantity,
// //         price: product.price,
// //         subtotal: product.price * item.quantity,
// //       });

// //       bulkStockUpdates.push({
// //         updateOne: {
// //           filter: { _id: product._id },
// //           update: { $inc: { stock: -item.quantity } },
// //         },
// //       });
// //     }

// //     await OrderItem.insertMany(orderItemsToInsert);
// //     await Product.bulkWrite(bulkStockUpdates);

// //     return res.status(201).json({
// //       success: true,
// //       message: "Order placed successfully",
// //       order: {
// //         orderNumber: order.orderNumber,
// //         shippingAddress: order.shippingAddress,
// //         subtotal: order.subtotal,
// //         discount: order.discount,
// //         deliveryFee: order.deliveryFee,
// //         tax: order.tax,
// //         totalAmount: order.totalAmount,
// //         paymentMethod: order.paymentMethod,
// //         paymentStatus: order.paymentStatus,
// //         orderStatus: order.orderStatus,
// //         tracking: order.tracking,
// //         placedAt: order.placedAt,
// //       },
// //     });
// //   } catch (error) {
// //     return res.status(500).json({
// //       success: false,
// //       message: error.message,
// //     });
// //   }
// // };

// // // ================================
// // // Get My Orders
// // // ================================
// // const getMyOrders = async (req, res) => {
// //   try {
// //     const orders = await Order.find({
// //       user: req.user._id,
// //     }).sort({ createdAt: -1 });

// //     const formattedOrders = await Promise.all(
// //       orders.map(async (order) => {

// //         const items = await OrderItem.find({
// //           order: order._id,
// //         });

// //         return {

// //           _id: order._id,
// //           orderNumber: order.orderNumber,
// //           totalAmount: order.totalAmount,
// //           paymentMethod: order.paymentMethod,
// //           paymentStatus: order.paymentStatus,
// //           orderStatus: order.orderStatus,
// //           tracking: order.tracking,
// //           placedAt: order.placedAt,

// //           itemCount: items.length,

// //           items: items.map(item => ({
// //             productName: item.productName,
// //             productImage: item.productImage,
// //             quantity: item.quantity,
// //             price: item.price,
// //             subtotal: item.subtotal,
// //           })),
// //         };
// //       })
// //     );

// //     res.status(200).json({
// //       success: true,
// //       count: formattedOrders.length,
// //       orders: formattedOrders,
// //     });

// //   } catch (error) {
// //     res.status(500).json({
// //       success: false,
// //       message: error.message,
// //     });
// //   }
// // };

// // // ================================
// // // Get Order By ID
// // // ================================
// // const getOrderById = async (req, res) => {
// //   try {
// //     const order = await Order.findById(req.params.id).populate("user", "fullName phone");

// //     if (!order) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Order not found",
// //       });
// //     }

// //     if (!order.tracking) {
// //       return res.status(200).json({
// //         success: true,
// //         message: "Tracking not available yet",
// //         tracking: null,
// //       });
// //     }

// //     const items = await OrderItem.find({ order: order._id }).populate("product", "name image price");

// //     const formattedItems = items.map((item) => ({
// //       productName: item.productName,
// //       productImage: item.productImage,
// //       quantity: item.quantity,
// //       price: item.price,
// //       subtotal: item.subtotal,
// //     }));

// //     return res.status(200).json({
// //       success: true,
// //       order: {
// //         orderNumber: order.orderNumber,
// //         shippingAddress: order.shippingAddress,
// //         subtotal: order.subtotal,
// //         discount: order.discount,
// //         deliveryFee: order.deliveryFee,
// //         tax: order.tax,
// //         totalAmount: order.totalAmount,
// //         paymentMethod: order.paymentMethod,
// //         paymentStatus: order.paymentStatus,
// //         orderStatus: order.orderStatus,
// //         tracking: order.tracking,
// //         placedAt: order.placedAt,
// //       },
// //       items: formattedItems,
// //     });
// //   } catch (error) {
// //     return res.status(500).json({
// //       success: false,
// //       message: error.message,
// //     });
// //   }
// // };

// // // ================================
// // // Get All Orders
// // // ================================
// // const getAllOrders = async (req, res) => {
// //   try {
// //     const orders = await Order.find()
// //       .populate("user", "fullName phone")
// //       .sort({ createdAt: -1 });

// //     const formattedOrders = orders.map((order) => ({
// //       orderNumber: order.orderNumber,
// //       customer: order.user?.fullName,
// //       phone: order.user?.phone,
// //       totalAmount: order.totalAmount,
// //       paymentStatus: order.paymentStatus,
// //       orderStatus: order.orderStatus,
// //       tracking: order.tracking,
// //       placedAt: order.placedAt,
// //     }));

// //     return res.status(200).json({
// //       success: true,
// //       count: formattedOrders.length,
// //       orders: formattedOrders,
// //     });
// //   } catch (error) {
// //     return res.status(500).json({
// //       success: false,
// //       message: error.message,
// //     });
// //   }
// // };

// // // ================================
// // // Update Order Status
// // // ================================
// // const updateOrderStatus = async (req, res) => {
// //   try {
// //     const { orderStatus } = req.body;
// //     const order = await Order.findById(req.params.id);

// //     if (!order) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Order not found",
// //       });
// //     }

// //     if (!order.tracking) {
// //       order.tracking = {
// //         status: "Order Placed",
// //         currentLocation: "Warehouse",
// //         estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
// //         trackingHistory: [],
// //       };
// //     }

// //     const locationMap = {
// //       confirmed: "Warehouse",
// //       packed: "Warehouse",
// //       shipped: "City Warehouse",
// //       out_for_delivery: "Local Delivery Hub",
// //       delivered: "Customer Address",
// //       cancelled: "Cancelled",
// //     };

// //     const statusMap = {
// //       confirmed: "Confirmed",
// //       packed: "Packed",
// //       shipped: "Shipped",
// //       out_for_delivery: "Out For Delivery",
// //       delivered: "Delivered",
// //       cancelled: "Cancelled",
// //     };

// //     order.orderStatus = orderStatus;
// //     order.tracking.status = statusMap[orderStatus] || orderStatus;
// //     order.tracking.currentLocation = locationMap[orderStatus] || "Warehouse";

// //     if (!order.tracking.trackingHistory) {
// //       order.tracking.trackingHistory = [];
// //     }

// //     order.tracking.trackingHistory.push({
// //       status: statusMap[orderStatus] || orderStatus,
// //       location: locationMap[orderStatus] || "Warehouse",
// //       time: new Date(),
// //     });

// //     if (orderStatus === "delivered") {
// //       order.deliveredAt = new Date();
// //       order.paymentStatus = "paid";
// //     }

// //     await order.save();

// //     return res.status(200).json({
// //       success: true,
// //       message: "Order status updated",
// //       order: {
// //         orderNumber: order.orderNumber,
// //         orderStatus: order.orderStatus,
// //         paymentStatus: order.paymentStatus,
// //         tracking: order.tracking,
// //       },
// //     });
// //   } catch (error) {
// //     return res.status(500).json({
// //       success: false,
// //       message: error.message,
// //     });
// //   }
// // };

// // // ================================
// // // Cancel Order
// // // ================================
// // const cancelOrder = async (req, res) => {
// //   try {
// //     const order = await Order.findById(req.params.id);

// //     if (!order) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Order not found",
// //       });
// //     }

// //     if (order.orderStatus === "delivered") {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Delivered order cannot be cancelled",
// //       });
// //     }

// //     if (!order.tracking) {
// //       order.tracking = {
// //         status: "Order Placed",
// //         currentLocation: "Warehouse",
// //         estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
// //         trackingHistory: [],
// //       };
// //     }

// //     const items = await OrderItem.find({ order: order._id });

// //     // Restock items in bulk
// //     const bulkStockRestock = items.map((item) => ({
// //       updateOne: {
// //         filter: { _id: item.product },
// //         update: { $inc: { stock: item.quantity } },
// //       },
// //     }));

// //     if (bulkStockRestock.length > 0) {
// //       await Product.bulkWrite(bulkStockRestock);
// //     }

// //     order.orderStatus = "cancelled";
// //     order.tracking.status = "Cancelled";
// //     order.tracking.currentLocation = "Cancelled";

// //     if (!order.tracking.trackingHistory) {
// //       order.tracking.trackingHistory = [];
// //     }

// //     order.tracking.trackingHistory.push({
// //       status: "Cancelled",
// //       location: "Cancelled",
// //       time: new Date(),
// //     });

// //     await order.save();

// //     return res.status(200).json({
// //       success: true,
// //       message: "Order cancelled successfully",
// //     });
// //   } catch (error) {
// //     return res.status(500).json({
// //       success: false,
// //       message: error.message,
// //     });
// //   }
// // };

// // // ================================
// // // Track Order
// // // ================================
// // const trackOrder = async (req, res) => {
// //   try {
// //     const order = await Order.findById(req.params.id);

// //     if (!order) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Order not found",
// //       });
// //     }

// //     return res.status(200).json({
// //       success: true,
// //       orderNumber: order.orderNumber,
// //       tracking: order.tracking,
// //     });
// //   } catch (error) {
// //     return res.status(500).json({
// //       success: false,
// //       message: error.message,
// //     });
// //   }
// // };

// // module.exports = {
// //   createOrder,
// //   getMyOrders,
// //   getOrderById,
// //   getAllOrders,
// //   updateOrderStatus,
// //   cancelOrder,
// //   trackOrder,

// // };

// // const Order = require("../models/Order");
// // const OrderItem = require("../models/OrderItem");
// // const Product = require("../models/Product");
// // const Notification = require("../models/Notification");

// // // ================================
// // // Generate Order Number
// // // ================================
// // const generateOrderNumber = async () => {
// //   const count = await Order.countDocuments();
// //   return `ORD${String(10001 + count)}`;
// // };

// // // ================================
// // // Create Order
// // // ================================
// // const createOrder = async (req, res) => {
// //   try {
// //     const {
// //       items,
// //       shippingAddress,
// //       paymentMethod,
// //       discount = 0,
// //       deliveryFee = 0,
// //       tax = 0,
// //     } = req.body;

// //     if (!items || items.length === 0) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Order items are required",
// //       });
// //     }

// //     // Batch fetch all requested products to avoid N+1 database hits
// //     const productIds = items.map((item) => item.product);
// //     const products = await Product.find({ _id: { $in: productIds } });
// //     const productMap = new Map(products.map((p) => [p._id.toString(), p]));

// //     let subtotal = 0;

// //     // Validate stock and calculate subtotal
// //     for (const item of items) {
// //       const product = productMap.get(item.product.toString());

// //       if (!product) {
// //         return res.status(404).json({
// //           success: false,
// //           message: `Product not found: ${item.product}`,
// //         });
// //       }

// //       if (product.stock < item.quantity) {
// //         return res.status(400).json({
// //           success: false,
// //           message: `${product.name} is out of stock`,
// //         });
// //       }

// //       subtotal += product.price * item.quantity;
// //     }

// //     const totalAmount = subtotal - discount + deliveryFee + tax;
// //     const orderNumber = await generateOrderNumber();

// //     // Create Order document
// //     const order = await Order.create({
// //       orderNumber,
// //       user: req.user._id,
// //       shippingAddress,
// //       subtotal,
// //       discount,
// //       deliveryFee,
// //       tax,
// //       totalAmount,
// //       paymentMethod,
// //       tracking: {
// //         status: "Order Placed",
// //         currentLocation: "Warehouse",
// //         estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
// //         trackingHistory: [
// //           {
// //             status: "Order Placed",
// //             location: "Warehouse",
// //             time: new Date(),
// //           },
// //         ],
// //       },
// //     });

// //     // Create Notification
// //     await Notification.create({
// //       user: req.user._id,
// //       title: "Order Placed",
// //       message: `Your order ${order.orderNumber} has been placed successfully.`,
// //       type: "order",
// //     });

// //     // Prepare order items & bulk operations for stock updates
// //     const orderItemsToInsert = [];
// //     const bulkStockUpdates = [];

// //     for (const item of items) {
// //       const product = productMap.get(item.product.toString());

// //       orderItemsToInsert.push({
// //         order: order._id,
// //         product: product._id,
// //         productName: product.name,
// //         productImage: product.image,
// //         quantity: item.quantity,
// //         price: product.price,
// //         subtotal: product.price * item.quantity,
// //       });

// //       bulkStockUpdates.push({
// //         updateOne: {
// //           filter: { _id: product._id },
// //           update: { $inc: { stock: -item.quantity } },
// //         },
// //       });
// //     }

// //     await OrderItem.insertMany(orderItemsToInsert);
// //     await Product.bulkWrite(bulkStockUpdates);

// //     return res.status(201).json({
// //       success: true,
// //       message: "Order placed successfully",
// //       order: {
// //         orderNumber: order.orderNumber,
// //         shippingAddress: order.shippingAddress,
// //         subtotal: order.subtotal,
// //         discount: order.discount,
// //         deliveryFee: order.deliveryFee,
// //         tax: order.tax,
// //         totalAmount: order.totalAmount,
// //         paymentMethod: order.paymentMethod,
// //         paymentStatus: order.paymentStatus,
// //         orderStatus: order.orderStatus,
// //         tracking: order.tracking,
// //         placedAt: order.placedAt,
// //       },
// //     });
// //   } catch (error) {
// //     return res.status(500).json({
// //       success: false,
// //       message: error.message,
// //     });
// //   }
// // };

// // // ================================
// // // Get My Orders
// // // ================================
// // const getMyOrders = async (req, res) => {
// //   try {
// //     const orders = await Order.find({
// //       user: req.user._id,
// //     }).sort({ createdAt: -1 });

// //     const formattedOrders = await Promise.all(
// //       orders.map(async (order) => {

// //         const items = await OrderItem.find({
// //           order: order._id,
// //         });

// //         return {

// //           _id: order._id,
// //           orderNumber: order.orderNumber,
// //           totalAmount: order.totalAmount,
// //           paymentMethod: order.paymentMethod,
// //           paymentStatus: order.paymentStatus,
// //           orderStatus: order.orderStatus,
// //           tracking: order.tracking,
// //           placedAt: order.placedAt,

// //           itemCount: items.length,

// //           items: items.map(item => ({
// //             productName: item.productName,
// //             productImage: item.productImage,
// //             quantity: item.quantity,
// //             price: item.price,
// //             subtotal: item.subtotal,
// //           })),
// //         };
// //       })
// //     );

// //     res.status(200).json({
// //       success: true,
// //       count: formattedOrders.length,
// //       orders: formattedOrders,
// //     });

// //   } catch (error) {
// //     res.status(500).json({
// //       success: false,
// //       message: error.message,
// //     });
// //   }
// // };

// // // ================================
// // // Get Order By ID
// // // ================================
// // const getOrderById = async (req, res) => {
// //   try {
// //     const order = await Order.findById(req.params.id).populate("user", "fullName phone");

// //     if (!order) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Order not found",
// //       });
// //     }

// //     if (!order.tracking) {
// //       return res.status(200).json({
// //         success: true,
// //         message: "Tracking not available yet",
// //         tracking: null,
// //       });
// //     }

// //     const items = await OrderItem.find({ order: order._id }).populate("product", "name image price");

// //     const formattedItems = items.map((item) => ({
// //       productName: item.productName,
// //       productImage: item.productImage,
// //       quantity: item.quantity,
// //       price: item.price,
// //       subtotal: item.subtotal,
// //     }));

// //     return res.status(200).json({
// //       success: true,
// //       order: {
// //         orderNumber: order.orderNumber,
// //         shippingAddress: order.shippingAddress,
// //         subtotal: order.subtotal,
// //         discount: order.discount,
// //         deliveryFee: order.deliveryFee,
// //         tax: order.tax,
// //         totalAmount: order.totalAmount,
// //         paymentMethod: order.paymentMethod,
// //         paymentStatus: order.paymentStatus,
// //         orderStatus: order.orderStatus,
// //         tracking: order.tracking,
// //         placedAt: order.placedAt,
// //       },
// //       items: formattedItems,
// //     });
// //   } catch (error) {
// //     return res.status(500).json({
// //       success: false,
// //       message: error.message,
// //     });
// //   }
// // };

// // // ================================
// // // Get All Orders
// // // ================================
// // const getAllOrders = async (req, res) => {
// //   try {
// //     const orders = await Order.find()
// //       .populate("user", "fullName phone")
// //       .sort({ createdAt: -1 });

// //     const formattedOrders = orders.map((order) => ({
// //       orderNumber: order.orderNumber,
// //       customer: order.user?.fullName,
// //       phone: order.user?.phone,
// //       totalAmount: order.totalAmount,
// //       paymentStatus: order.paymentStatus,
// //       orderStatus: order.orderStatus,
// //       tracking: order.tracking,
// //       placedAt: order.placedAt,
// //     }));

// //     return res.status(200).json({
// //       success: true,
// //       count: formattedOrders.length,
// //       orders: formattedOrders,
// //     });
// //   } catch (error) {
// //     return res.status(500).json({
// //       success: false,
// //       message: error.message,
// //     });
// //   }
// // };

// // // ================================
// // // Update Order Status
// // // ================================
// // const updateOrderStatus = async (req, res) => {
// //   try {
// //     const { orderStatus } = req.body;
// //     const order = await Order.findById(req.params.id);

// //     if (!order) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Order not found",
// //       });
// //     }

// //     if (!order.tracking) {
// //       order.tracking = {
// //         status: "Order Placed",
// //         currentLocation: "Warehouse",
// //         estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
// //         trackingHistory: [],
// //       };
// //     }

// //     const locationMap = {
// //       confirmed: "Warehouse",
// //       packed: "Warehouse",
// //       shipped: "City Warehouse",
// //       out_for_delivery: "Local Delivery Hub",
// //       delivered: "Customer Address",
// //       cancelled: "Cancelled",
// //     };

// //     const statusMap = {
// //       confirmed: "Confirmed",
// //       packed: "Packed",
// //       shipped: "Shipped",
// //       out_for_delivery: "Out For Delivery",
// //       delivered: "Delivered",
// //       cancelled: "Cancelled",
// //     };

// //     order.orderStatus = orderStatus;
// //     order.tracking.status = statusMap[orderStatus] || orderStatus;
// //     order.tracking.currentLocation = locationMap[orderStatus] || "Warehouse";

// //     if (!order.tracking.trackingHistory) {
// //       order.tracking.trackingHistory = [];
// //     }

// //     order.tracking.trackingHistory.push({
// //       status: statusMap[orderStatus] || orderStatus,
// //       location: locationMap[orderStatus] || "Warehouse",
// //       time: new Date(),
// //     });

// //     if (orderStatus === "delivered") {
// //       order.deliveredAt = new Date();
// //       order.paymentStatus = "paid";
// //     }

// //     await order.save();

// //     return res.status(200).json({
// //       success: true,
// //       message: "Order status updated",
// //       order: {
// //         orderNumber: order.orderNumber,
// //         orderStatus: order.orderStatus,
// //         paymentStatus: order.paymentStatus,
// //         tracking: order.tracking,
// //       },
// //     });
// //   } catch (error) {
// //     return res.status(500).json({
// //       success: false,
// //       message: error.message,
// //     });
// //   }
// // };

// // // ================================
// // // Cancel Order
// // // ================================
// // const cancelOrder = async (req, res) => {
// //   try {
// //     const order = await Order.findById(req.params.id);

// //     if (!order) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Order not found",
// //       });
// //     }

// //     if (order.orderStatus === "delivered") {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Delivered order cannot be cancelled",
// //       });
// //     }

// //     if (!order.tracking) {
// //       order.tracking = {
// //         status: "Order Placed",
// //         currentLocation: "Warehouse",
// //         estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
// //         trackingHistory: [],
// //       };
// //     }

// //     const items = await OrderItem.find({ order: order._id });

// //     // Restock items in bulk
// //     const bulkStockRestock = items.map((item) => ({
// //       updateOne: {
// //         filter: { _id: item.product },
// //         update: { $inc: { stock: item.quantity } },
// //       },
// //     }));

// //     if (bulkStockRestock.length > 0) {
// //       await Product.bulkWrite(bulkStockRestock);
// //     }

// //     order.orderStatus = "cancelled";
// //     order.tracking.status = "Cancelled";
// //     order.tracking.currentLocation = "Cancelled";

// //     if (!order.tracking.trackingHistory) {
// //       order.tracking.trackingHistory = [];
// //     }

// //     order.tracking.trackingHistory.push({
// //       status: "Cancelled",
// //       location: "Cancelled",
// //       time: new Date(),
// //     });

// //     await order.save();

// //     return res.status(200).json({
// //       success: true,
// //       message: "Order cancelled successfully",
// //     });
// //   } catch (error) {
// //     return res.status(500).json({
// //       success: false,
// //       message: error.message,
// //     });
// //   }
// // };

// // // ================================
// // // Track Order
// // // ================================
// // const trackOrder = async (req, res) => {
// //   try {
// //     const order = await Order.findById(req.params.id);

// //     if (!order) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Order not found",
// //       });
// //     }

// //     return res.status(200).json({
// //       success: true,
// //       orderNumber: order.orderNumber,
// //       tracking: order.tracking,
// //     });
// //   } catch (error) {
// //     return res.status(500).json({
// //       success: false,
// //       message: error.message,
// //     });
// //   }
// // };

// // module.exports = {
// //   createOrder,
// //   getMyOrders,
// //   getOrderById,
// //   getAllOrders,
// //   updateOrderStatus,
// //   cancelOrder,
// //   trackOrder,

// // };

// const Order = require("../models/Order");
// const OrderItem = require("../models/OrderItem");
// const Product = require("../models/Product");
// const Notification = require("../models/Notification");
// const User = require("../models/User");

// // ================================
// // Generate Order Number
// // ================================
// const generateOrderNumber = async () => {
//   const count = await Order.countDocuments();
//   return `ORD${String(10001 + count)}`;
// };

// // ================================
// // Create Order
// // ================================
// const createOrder = async (req, res) => {
//   try {
//     const {
//       items,
//       shippingAddress,
//       paymentMethod,
//       discount = 0,
//       deliveryFee = 0,
//       tax = 0,
//     } = req.body;

//     // Guard against string values from the request body producing
//     // string concatenation instead of arithmetic below
//     const discountNum = Number(discount) || 0;
//     const deliveryFeeNum = Number(deliveryFee) || 0;
//     const taxNum = Number(tax) || 0;

//     if (!items || items.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Order items are required",
//       });
//     }

//     // Batch fetch all requested products to avoid N+1 database hits
//     const productIds = items.map((item) => item.product);
//     const products = await Product.find({ _id: { $in: productIds } });
//     const productMap = new Map(products.map((p) => [p._id.toString(), p]));

//     let subtotal = 0;

//     // Validate stock and calculate subtotal
//     for (const item of items) {
//       const product = productMap.get(item.product.toString());

//       if (!product) {
//         return res.status(404).json({
//           success: false,
//           message: `Product not found: ${item.product}`,
//         });
//       }

//       if (product.stock < item.quantity) {
//         return res.status(400).json({
//           success: false,
//           message: `${product.name} is out of stock`,
//         });
//       }

//       subtotal += product.price * item.quantity;
//     }

//     const totalAmount = subtotal - discountNum + deliveryFeeNum + taxNum;
//     const orderNumber = await generateOrderNumber();

//     // Create Order document
//     const order = await Order.create({
//       orderNumber,
//       user: req.user._id,
//       shippingAddress,
//       subtotal,
//       discount: discountNum,
//       deliveryFee: deliveryFeeNum,
//       tax: taxNum,
//       totalAmount,
//       paymentMethod,
//       tracking: {
//         status: "Order Placed",
//         currentLocation: "Warehouse",
//         estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
//         trackingHistory: [
//           {
//             status: "Order Placed",
//             location: "Warehouse",
//             time: new Date(),
//           },
//         ],
//       },
//     });

//     // Create Notification (for the customer)
//     await Notification.create({
//       user: req.user._id,
//       title: "Order Placed",
//       message: `Your order ${order.orderNumber} has been placed successfully.`,
//       type: "order",
//     });

//     // Notify all admins about the new order
//     const admins = await User.find({ role: "admin" }).select("_id");
//     if (admins.length > 0) {
//       const customerName = req.user.fullName || req.user.username || "A customer";
//       await Notification.insertMany(
//         admins.map((admin) => ({
//           user: admin._id,
//           title: "New Order Received",
//           message: `${customerName} placed order ${order.orderNumber} for ₹${Number(order.totalAmount).toFixed(2)}.`,
//           type: "order",
//           order: order._id,
//         }))
//       );
//     }

//     // Prepare order items & bulk operations for stock updates
//     const orderItemsToInsert = [];
//     const bulkStockUpdates = [];

//     for (const item of items) {
//       const product = productMap.get(item.product.toString());

//       orderItemsToInsert.push({
//         order: order._id,
//         product: product._id,
//         productName: product.name,
//         productImage: product.image, // fallback if images array not used
//         quantity: item.quantity,
//         price: product.price,
//         subtotal: product.price * item.quantity,
//       });

//       bulkStockUpdates.push({
//         updateOne: {
//           filter: { _id: product._id },
//           update: { $inc: { stock: -item.quantity } },
//         },
//       });
//     }

//     await OrderItem.insertMany(orderItemsToInsert);
//     await Product.bulkWrite(bulkStockUpdates);

//     return res.status(201).json({
//       success: true,
//       message: "Order placed successfully",
//       order: {
//         orderNumber: order.orderNumber,
//         shippingAddress: order.shippingAddress,
//         subtotal: order.subtotal,
//         discount: order.discount,
//         deliveryFee: order.deliveryFee,
//         tax: order.tax,
//         totalAmount: order.totalAmount,
//         paymentMethod: order.paymentMethod,
//         paymentStatus: order.paymentStatus,
//         orderStatus: order.orderStatus,
//         tracking: order.tracking,
//         placedAt: order.placedAt,
//       },
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ================================
// // Get My Orders (Customer)
// // ================================
// const getMyOrders = async (req, res) => {
//   try {
//     const orders = await Order.find({
//       user: req.user._id,
//     }).sort({ createdAt: -1 });

//     const formattedOrders = await Promise.all(
//       orders.map(async (order) => {
//         const items = await OrderItem.find({
//           order: order._id,
//         });

//         return {
//           _id: order._id,
//           orderNumber: order.orderNumber,
//           totalAmount: order.totalAmount,
//           paymentMethod: order.paymentMethod,
//           paymentStatus: order.paymentStatus,
//           orderStatus: order.orderStatus,
//           tracking: order.tracking,
//           placedAt: order.placedAt,
//           itemCount: items.length,
//           items: items.map(item => ({
//             productName: item.productName,
//             productImage: item.productImage,
//             quantity: item.quantity,
//             price: item.price,
//             subtotal: item.subtotal,
//           })),
//         };
//       })
//     );

//     res.status(200).json({
//       success: true,
//       count: formattedOrders.length,
//       orders: formattedOrders,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ================================
// // Get Order By ID
// // ================================
// const getOrderById = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id).populate("user", "fullName phone");

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found",
//       });
//     }

//     const items = await OrderItem.find({ order: order._id }).populate("product", "name image price");

//     const formattedItems = items.map((item) => ({
//       productName: item.productName,
//       productImage: item.productImage,
//       quantity: item.quantity,
//       price: item.price,
//       subtotal: item.subtotal,
//     }));

//     return res.status(200).json({
//       success: true,
//       order: {
//         orderNumber: order.orderNumber,
//         shippingAddress: order.shippingAddress,
//         subtotal: order.subtotal,
//         discount: order.discount,
//         deliveryFee: order.deliveryFee,
//         tax: order.tax,
//         totalAmount: order.totalAmount,
//         paymentMethod: order.paymentMethod,
//         paymentStatus: order.paymentStatus,
//         orderStatus: order.orderStatus,
//         tracking: order.tracking,
//         placedAt: order.placedAt,
//       },
//       items: formattedItems,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ================================
// // Get All Orders (Admin) — ✅ UPDATED
// // ================================
// const getAllOrders = async (req, res) => {
//   try {
//     // 1. Fetch all orders
//     const orders = await Order.find()
//       .populate("user", "fullName phone")
//       .sort({ createdAt: -1 });

//     if (orders.length === 0) {
//       return res.status(200).json({
//         success: true,
//         count: 0,
//         orders: [],
//       });
//     }

//     // 2. Fetch all OrderItems for these orders in one query
//     const orderIds = orders.map((order) => order._id);
//     const allOrderItems = await OrderItem.find({ order: { $in: orderIds } })
//       .populate("product", "name images") // ensure Product model has 'images' field
//       .lean(); // lean for performance

//     // 3. Group items by order ID
//     const itemsByOrder = {};
//     allOrderItems.forEach((item) => {
//       const orderId = item.order.toString();
//       if (!itemsByOrder[orderId]) itemsByOrder[orderId] = [];
//       itemsByOrder[orderId].push(item);
//     });

//     // 4. Format orders with shippingAddress & products
//     const formattedOrders = orders.map((order) => {
//       const orderObj = order.toObject();
//       const items = itemsByOrder[order._id.toString()] || [];

//       // Transform items into the 'products' array expected by the frontend
//       const products = items.map((item) => ({
//         product: {
//           name: item.productName || item.product?.name || "Product",
//           images: item.product?.images || [item.productImage].filter(Boolean),
//           _id: item.product?._id || item.product,
//         },
//         quantity: item.quantity,
//         price: item.price,
//         subtotal: item.subtotal,
//       }));

//       return {
//         _id: orderObj._id,
//         orderNumber: orderObj.orderNumber,
//         customer: orderObj.user?.fullName || "Unknown",
//         phone: orderObj.user?.phone || "N/A",
//         totalAmount: orderObj.totalAmount,
//         subtotal: orderObj.subtotal,
//         discount: orderObj.discount,
//         deliveryFee: orderObj.deliveryFee,
//         tax: orderObj.tax,
//         paymentMethod: orderObj.paymentMethod,
//         paymentStatus: orderObj.paymentStatus,
//         orderStatus: orderObj.orderStatus,
//         placedAt: orderObj.placedAt,
//         // ✅ Include shippingAddress
//         shippingAddress: orderObj.shippingAddress || null,
//         // ✅ Include products for preview
//         products: products,
//         tracking: orderObj.tracking,
//       };
//     });

//     return res.status(200).json({
//       success: true,
//       count: formattedOrders.length,
//       orders: formattedOrders,
//     });
//   } catch (error) {
//     console.error("Error in getAllOrders:", error);
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ================================
// // Update Order Status
// // ================================
// const updateOrderStatus = async (req, res) => {
//   try {
//     const { orderStatus } = req.body;
//     const order = await Order.findById(req.params.id);

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found",
//       });
//     }

//     if (!order.tracking) {
//       order.tracking = {
//         status: "Order Placed",
//         currentLocation: "Warehouse",
//         estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
//         trackingHistory: [],
//       };
//     }

//     const locationMap = {
//       confirmed: "Warehouse",
//       packed: "Warehouse",
//       shipped: "City Warehouse",
//       out_for_delivery: "Local Delivery Hub",
//       delivered: "Customer Address",
//       cancelled: "Cancelled",
//     };

//     const statusMap = {
//       confirmed: "Confirmed",
//       packed: "Packed",
//       shipped: "Shipped",
//       out_for_delivery: "Out For Delivery",
//       delivered: "Delivered",
//       cancelled: "Cancelled",
//     };

//     order.orderStatus = orderStatus;
//     order.tracking.status = statusMap[orderStatus] || orderStatus;
//     order.tracking.currentLocation = locationMap[orderStatus] || "Warehouse";

//     if (!order.tracking.trackingHistory) {
//       order.tracking.trackingHistory = [];
//     }

//     order.tracking.trackingHistory.push({
//       status: statusMap[orderStatus] || orderStatus,
//       location: locationMap[orderStatus] || "Warehouse",
//       time: new Date(),
//     });

//     if (orderStatus === "delivered") {
//       order.deliveredAt = new Date();
//       order.paymentStatus = "paid";
//     }

//     await order.save();

//     return res.status(200).json({
//       success: true,
//       message: "Order status updated",
//       order: {
//         orderNumber: order.orderNumber,
//         orderStatus: order.orderStatus,
//         paymentStatus: order.paymentStatus,
//         tracking: order.tracking,
//       },
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
// // ================================
// // Delete Order (Admin only)
// // ================================
// const deleteOrder = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id);

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found",
//       });
//     }

//     // Optional: Prevent deletion of delivered orders
//     // if (order.orderStatus === "delivered") {
//     //   return res.status(400).json({
//     //     success: false,
//     //     message: "Delivered orders cannot be deleted",
//     //   });
//     // }

//     // Delete associated order items
//     await OrderItem.deleteMany({ order: order._id });

//     // Delete the order itself
//     await order.deleteOne();

//     res.status(200).json({
//       success: true,
//       message: "Order deleted successfully",
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
// // ================================
// // Cancel Order
// // ================================
// const cancelOrder = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id);

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found",
//       });
//     }

//     if (order.orderStatus === "delivered") {
//       return res.status(400).json({
//         success: false,
//         message: "Delivered order cannot be cancelled",
//       });
//     }

//     if (!order.tracking) {
//       order.tracking = {
//         status: "Order Placed",
//         currentLocation: "Warehouse",
//         estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
//         trackingHistory: [],
//       };
//     }

//     const items = await OrderItem.find({ order: order._id });

//     // Restock items in bulk
//     const bulkStockRestock = items.map((item) => ({
//       updateOne: {
//         filter: { _id: item.product },
//         update: { $inc: { stock: item.quantity } },
//       },
//     }));

//     if (bulkStockRestock.length > 0) {
//       await Product.bulkWrite(bulkStockRestock);
//     }

//     order.orderStatus = "cancelled";
//     order.tracking.status = "Cancelled";
//     order.tracking.currentLocation = "Cancelled";

//     if (!order.tracking.trackingHistory) {
//       order.tracking.trackingHistory = [];
//     }

//     order.tracking.trackingHistory.push({
//       status: "Cancelled",
//       location: "Cancelled",
//       time: new Date(),
//     });

//     await order.save();

//     return res.status(200).json({
//       success: true,
//       message: "Order cancelled successfully",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ================================
// // Track Order
// // ================================
// const trackOrder = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id);

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       orderNumber: order.orderNumber,
//       tracking: order.tracking,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ================================
// // Exports
// // ================================
// module.exports = {
//   createOrder,
//   getMyOrders,
//   getOrderById,
//   getAllOrders,
//   updateOrderStatus,
//   cancelOrder,
//   trackOrder,
//   deleteOrder,
// };

// const Order = require("../models/Order");
// const OrderItem = require("../models/OrderItem");
// const Product = require("../models/Product");
// const Notification = require("../models/Notification");

// // ================================
// // Generate Order Number
// // ================================
// const generateOrderNumber = async () => {
//   const count = await Order.countDocuments();
//   return `ORD${String(10001 + count)}`;
// };

// // ================================
// // Create Order
// // ================================
// const createOrder = async (req, res) => {
//   try {
//     const {
//       items,
//       shippingAddress,
//       paymentMethod,
//       discount = 0,
//       deliveryFee = 0,
//       tax = 0,
//     } = req.body;

//     if (!items || items.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Order items are required",
//       });
//     }

//     // Batch fetch all requested products to avoid N+1 database hits
//     const productIds = items.map((item) => item.product);
//     const products = await Product.find({ _id: { $in: productIds } });
//     const productMap = new Map(products.map((p) => [p._id.toString(), p]));

//     let subtotal = 0;

//     // Validate stock and calculate subtotal
//     for (const item of items) {
//       const product = productMap.get(item.product.toString());

//       if (!product) {
//         return res.status(404).json({
//           success: false,
//           message: `Product not found: ${item.product}`,
//         });
//       }

//       if (product.stock < item.quantity) {
//         return res.status(400).json({
//           success: false,
//           message: `${product.name} is out of stock`,
//         });
//       }

//       subtotal += product.price * item.quantity;
//     }

//     const totalAmount = subtotal - discount + deliveryFee + tax;
//     const orderNumber = await generateOrderNumber();

//     // Create Order document
//     const order = await Order.create({
//       orderNumber,
//       user: req.user._id,
//       shippingAddress,
//       subtotal,
//       discount,
//       deliveryFee,
//       tax,
//       totalAmount,
//       paymentMethod,
//       tracking: {
//         status: "Order Placed",
//         currentLocation: "Warehouse",
//         estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
//         trackingHistory: [
//           {
//             status: "Order Placed",
//             location: "Warehouse",
//             time: new Date(),
//           },
//         ],
//       },
//     });

//     // Create Notification
//     await Notification.create({
//       user: req.user._id,
//       title: "Order Placed",
//       message: `Your order ${order.orderNumber} has been placed successfully.`,
//       type: "order",
//     });

//     // Prepare order items & bulk operations for stock updates
//     const orderItemsToInsert = [];
//     const bulkStockUpdates = [];

//     for (const item of items) {
//       const product = productMap.get(item.product.toString());

//       orderItemsToInsert.push({
//         order: order._id,
//         product: product._id,
//         productName: product.name,
//         productImage: product.image,
//         quantity: item.quantity,
//         price: product.price,
//         subtotal: product.price * item.quantity,
//       });

//       bulkStockUpdates.push({
//         updateOne: {
//           filter: { _id: product._id },
//           update: { $inc: { stock: -item.quantity } },
//         },
//       });
//     }

//     await OrderItem.insertMany(orderItemsToInsert);
//     await Product.bulkWrite(bulkStockUpdates);

//     return res.status(201).json({
//       success: true,
//       message: "Order placed successfully",
//       order: {
//         orderNumber: order.orderNumber,
//         shippingAddress: order.shippingAddress,
//         subtotal: order.subtotal,
//         discount: order.discount,
//         deliveryFee: order.deliveryFee,
//         tax: order.tax,
//         totalAmount: order.totalAmount,
//         paymentMethod: order.paymentMethod,
//         paymentStatus: order.paymentStatus,
//         orderStatus: order.orderStatus,
//         tracking: order.tracking,
//         placedAt: order.placedAt,
//       },
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ================================
// // Get My Orders
// // ================================
// const getMyOrders = async (req, res) => {
//   try {
//     const orders = await Order.find({
//       user: req.user._id,
//     }).sort({ createdAt: -1 });

//     const formattedOrders = await Promise.all(
//       orders.map(async (order) => {

//         const items = await OrderItem.find({
//           order: order._id,
//         });

//         return {

//           _id: order._id,
//           orderNumber: order.orderNumber,
//           totalAmount: order.totalAmount,
//           paymentMethod: order.paymentMethod,
//           paymentStatus: order.paymentStatus,
//           orderStatus: order.orderStatus,
//           tracking: order.tracking,
//           placedAt: order.placedAt,

//           itemCount: items.length,

//           items: items.map(item => ({
//             productName: item.productName,
//             productImage: item.productImage,
//             quantity: item.quantity,
//             price: item.price,
//             subtotal: item.subtotal,
//           })),
//         };
//       })
//     );

//     res.status(200).json({
//       success: true,
//       count: formattedOrders.length,
//       orders: formattedOrders,
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ================================
// // Get Order By ID
// // ================================
// const getOrderById = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id).populate("user", "fullName phone");

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found",
//       });
//     }

//     if (!order.tracking) {
//       return res.status(200).json({
//         success: true,
//         message: "Tracking not available yet",
//         tracking: null,
//       });
//     }

//     const items = await OrderItem.find({ order: order._id }).populate("product", "name image price");

//     const formattedItems = items.map((item) => ({
//       productName: item.productName,
//       productImage: item.productImage,
//       quantity: item.quantity,
//       price: item.price,
//       subtotal: item.subtotal,
//     }));

//     return res.status(200).json({
//       success: true,
//       order: {
//         orderNumber: order.orderNumber,
//         shippingAddress: order.shippingAddress,
//         subtotal: order.subtotal,
//         discount: order.discount,
//         deliveryFee: order.deliveryFee,
//         tax: order.tax,
//         totalAmount: order.totalAmount,
//         paymentMethod: order.paymentMethod,
//         paymentStatus: order.paymentStatus,
//         orderStatus: order.orderStatus,
//         tracking: order.tracking,
//         placedAt: order.placedAt,
//       },
//       items: formattedItems,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ================================
// // Get All Orders
// // ================================
// const getAllOrders = async (req, res) => {
//   try {
//     const orders = await Order.find()
//       .populate("user", "fullName phone")
//       .sort({ createdAt: -1 });

//     const formattedOrders = orders.map((order) => ({
//       orderNumber: order.orderNumber,
//       customer: order.user?.fullName,
//       phone: order.user?.phone,
//       totalAmount: order.totalAmount,
//       paymentStatus: order.paymentStatus,
//       orderStatus: order.orderStatus,
//       tracking: order.tracking,
//       placedAt: order.placedAt,
//     }));

//     return res.status(200).json({
//       success: true,
//       count: formattedOrders.length,
//       orders: formattedOrders,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ================================
// // Update Order Status
// // ================================
// const updateOrderStatus = async (req, res) => {
//   try {
//     const { orderStatus } = req.body;
//     const order = await Order.findById(req.params.id);

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found",
//       });
//     }

//     if (!order.tracking) {
//       order.tracking = {
//         status: "Order Placed",
//         currentLocation: "Warehouse",
//         estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
//         trackingHistory: [],
//       };
//     }

//     const locationMap = {
//       confirmed: "Warehouse",
//       packed: "Warehouse",
//       shipped: "City Warehouse",
//       out_for_delivery: "Local Delivery Hub",
//       delivered: "Customer Address",
//       cancelled: "Cancelled",
//     };

//     const statusMap = {
//       confirmed: "Confirmed",
//       packed: "Packed",
//       shipped: "Shipped",
//       out_for_delivery: "Out For Delivery",
//       delivered: "Delivered",
//       cancelled: "Cancelled",
//     };

//     order.orderStatus = orderStatus;
//     order.tracking.status = statusMap[orderStatus] || orderStatus;
//     order.tracking.currentLocation = locationMap[orderStatus] || "Warehouse";

//     if (!order.tracking.trackingHistory) {
//       order.tracking.trackingHistory = [];
//     }

//     order.tracking.trackingHistory.push({
//       status: statusMap[orderStatus] || orderStatus,
//       location: locationMap[orderStatus] || "Warehouse",
//       time: new Date(),
//     });

//     if (orderStatus === "delivered") {
//       order.deliveredAt = new Date();
//       order.paymentStatus = "paid";
//     }

//     await order.save();

//     return res.status(200).json({
//       success: true,
//       message: "Order status updated",
//       order: {
//         orderNumber: order.orderNumber,
//         orderStatus: order.orderStatus,
//         paymentStatus: order.paymentStatus,
//         tracking: order.tracking,
//       },
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ================================
// // Cancel Order
// // ================================
// const cancelOrder = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id);

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found",
//       });
//     }

//     if (order.orderStatus === "delivered") {
//       return res.status(400).json({
//         success: false,
//         message: "Delivered order cannot be cancelled",
//       });
//     }

//     if (!order.tracking) {
//       order.tracking = {
//         status: "Order Placed",
//         currentLocation: "Warehouse",
//         estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
//         trackingHistory: [],
//       };
//     }

//     const items = await OrderItem.find({ order: order._id });

//     // Restock items in bulk
//     const bulkStockRestock = items.map((item) => ({
//       updateOne: {
//         filter: { _id: item.product },
//         update: { $inc: { stock: item.quantity } },
//       },
//     }));

//     if (bulkStockRestock.length > 0) {
//       await Product.bulkWrite(bulkStockRestock);
//     }

//     order.orderStatus = "cancelled";
//     order.tracking.status = "Cancelled";
//     order.tracking.currentLocation = "Cancelled";

//     if (!order.tracking.trackingHistory) {
//       order.tracking.trackingHistory = [];
//     }

//     order.tracking.trackingHistory.push({
//       status: "Cancelled",
//       location: "Cancelled",
//       time: new Date(),
//     });

//     await order.save();

//     return res.status(200).json({
//       success: true,
//       message: "Order cancelled successfully",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ================================
// // Track Order
// // ================================
// const trackOrder = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id);

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       orderNumber: order.orderNumber,
//       tracking: order.tracking,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// module.exports = {
//   createOrder,
//   getMyOrders,
//   getOrderById,
//   getAllOrders,
//   updateOrderStatus,
//   cancelOrder,
//   trackOrder,

// };

const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Product = require("../models/Product");
const Notification = require("../models/Notification");
const User = require("../models/User");

// ================================
// Generate Order Number
// ================================
const generateOrderNumber = async () => {
  const count = await Order.countDocuments();
  return `ORD${String(10001 + count)}`;
};

// ================================
// Validate Shipping Address
// ================================
const validateShippingAddress = (shippingAddress) => {
  if (!shippingAddress || typeof shippingAddress !== "object") {
    return "Shipping address is required";
  }

  const { fullName, address, city, state, pincode, phone } = shippingAddress;

  if (!fullName || !address || !city || !state || !pincode || !phone) {
    return "All shipping address fields are required";
  }

  const trimmedName = String(fullName).trim();
  if (trimmedName.length < 3 || trimmedName.length > 15) {
    return "Full name must be between 3 and 15 characters";
  }

  const trimmedAddress = String(address).trim();
  if (trimmedAddress.length < 5 || trimmedAddress.length > 100) {
    return "Address must be between 5 and 100 characters";
  }

  // City & State: letters and spaces only, 2-30 characters
  const nameRegex = /^[A-Za-z\s]{2,30}$/;
  if (!nameRegex.test(String(city).trim())) {
    return "City must contain only letters and be 2-30 characters long";
  }
  if (!nameRegex.test(String(state).trim())) {
    return "State must contain only letters and be 2-30 characters long";
  }

  // Indian Pincode: exactly 6 digits, first digit 1-9 (not 0)
  const pincodeRegex = /^[1-9][0-9]{5}$/;
  if (!pincodeRegex.test(String(pincode).trim())) {
    return "Enter a valid 6-digit pincode";
  }

  // Phone: 10 digits, starting 6-9 (Indian mobile)
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phoneRegex.test(String(phone).trim())) {
    return "Enter a valid 10-digit phone number";
  }

  return null; // no errors
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

    // Guard against string values from the request body producing
    // string concatenation instead of arithmetic below
    const discountNum = Number(discount) || 0;
    const deliveryFeeNum = Number(deliveryFee) || 0;
    const taxNum = Number(tax) || 0;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order items are required",
      });
    }

    // Validate shipping address (fullName, address, city, state, pincode, phone)
    const shippingError = validateShippingAddress(shippingAddress);
    if (shippingError) {
      return res.status(400).json({
        success: false,
        message: shippingError,
      });
    }

    // Guard against string values from the request body producing
    // string concatenation instead of arithmetic below
   // const discountNum = Number(discount) || 0;
   // const deliveryFeeNum = Number(deliveryFee) || 0;
   // const taxNum = Number(tax) || 0;

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

    const totalAmount = subtotal - discountNum + deliveryFeeNum + taxNum;
    const orderNumber = await generateOrderNumber();

    // Create Order document
    const order = await Order.create({
      orderNumber,
      user: req.user._id,
      shippingAddress,
      subtotal,
      discount: discountNum,
      deliveryFee: deliveryFeeNum,
      tax: taxNum,
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

    // Create Notification (for the customer)
    await Notification.create({
      user: req.user._id,
      title: "Order Placed",
      message: `Your order ${order.orderNumber} has been placed successfully.`,
      type: "order",
    });

    // Notify all admins about the new order
    const admins = await User.find({ role: "admin" }).select("_id");
    if (admins.length > 0) {
      const customerName = req.user.fullName || req.user.username || "A customer";
      await Notification.insertMany(
        admins.map((admin) => ({
          user: admin._id,
          title: "New Order Received",
          message: `${customerName} placed order ${order.orderNumber} for ₹${Number(order.totalAmount).toFixed(2)}.`,
          type: "order",
          order: order._id,
        }))
      );
    }

    // Prepare order items & bulk operations for stock updates
    const orderItemsToInsert = [];
    const bulkStockUpdates = [];

    for (const item of items) {
      const product = productMap.get(item.product.toString());

      orderItemsToInsert.push({
        order: order._id,
        product: product._id,
        productName: product.name,
       productImage: product.image, // fallback if images array not used
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
// Get My Orders (Customer)
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
// Get All Orders (Admin)
// ================================
const getAllOrders = async (req, res) => {
  try {
    // 1. Fetch all orders
    const orders = await Order.find()
      .populate("user", "fullName phone")
      .sort({ createdAt: -1 });

    if (orders.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        orders: [],
      });
    }

    // 2. Fetch all OrderItems for these orders in one query
    const orderIds = orders.map((order) => order._id);
    const allOrderItems = await OrderItem.find({ order: { $in: orderIds } })
      .populate("product", "name images") // ensure Product model has 'images' field
      .lean(); // lean for performance

    // 3. Group items by order ID
    const itemsByOrder = {};
    allOrderItems.forEach((item) => {
      const orderId = item.order.toString();
      if (!itemsByOrder[orderId]) itemsByOrder[orderId] = [];
      itemsByOrder[orderId].push(item);
    });

    // 4. Format orders with shippingAddress & products
    const formattedOrders = orders.map((order) => {
      const orderObj = order.toObject();
      const items = itemsByOrder[order._id.toString()] || [];

      // Transform items into the 'products' array expected by the frontend
      const products = items.map((item) => ({
        product: {
          name: item.productName || item.product?.name || "Product",
          images: item.product?.images || [item.productImage].filter(Boolean),
          _id: item.product?._id || item.product,
        },
        quantity: item.quantity,
        price: item.price,
        subtotal: item.subtotal,
      }));

      return {
        _id: orderObj._id,
        orderNumber: orderObj.orderNumber,
        customer: orderObj.user?.fullName || "Unknown",
        phone: orderObj.user?.phone || "N/A",
        totalAmount: orderObj.totalAmount,
        subtotal: orderObj.subtotal,
        discount: orderObj.discount,
        deliveryFee: orderObj.deliveryFee,
        tax: orderObj.tax,
        paymentMethod: orderObj.paymentMethod,
        paymentStatus: orderObj.paymentStatus,
        orderStatus: orderObj.orderStatus,
        placedAt: orderObj.placedAt,
        shippingAddress: orderObj.shippingAddress || null,
        products: products,
        tracking: orderObj.tracking,
      };
    });

    return res.status(200).json({
      success: true,
      count: formattedOrders.length,
      orders: formattedOrders,
    });
  } catch (error) {
    console.error("Error in getAllOrders:", error);
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
// Delete Order (Admin only)
// ================================
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Optional: Prevent deletion of delivered orders
    // if (order.orderStatus === "delivered") {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Delivered orders cannot be deleted",
    //   });
    // }

    // Delete associated order items
    await OrderItem.deleteMany({ order: order._id });

    // Delete the order itself
    await order.deleteOne();

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
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

// ================================
// Exports
// ================================
module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  trackOrder,
  deleteOrder,
};