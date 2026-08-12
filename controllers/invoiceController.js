// // // // // const Order = require("../models/Order");
// // // // // const OrderItem = require("../models/OrderItem");

// // // // // // ========================================
// // // // // // Generate Invoice
// // // // // // ========================================
// // // // // exports.generateInvoice = async (req, res) => {
// // // // //   try {
// // // // //     const { orderId } = req.params;

// // // // //     const order = await Order.findById(orderId)
// // // // //       .populate("user", "fullName phone email");

// // // // //     if (!order) {
// // // // //       return res.status(404).json({
// // // // //         success: false,
// // // // //         message: "Order not found",
// // // // //       });
// // // // //     }

// // // // //     // Invoice already generated
// // // // //     if (order.invoiceGenerated && order.invoiceNumber) {
// // // // //       return res.status(200).json({
// // // // //         success: true,
// // // // //         message: "Invoice already generated",
// // // // //         invoiceNumber: order.invoiceNumber,
// // // // //         invoiceGeneratedAt: order.invoiceGeneratedAt,
// // // // //         order,
// // // // //       });
// // // // //     }

// // // // //     // Generate invoice number
// // // // //     const invoiceNumber =
// // // // //       "INV-" +
// // // // //       new Date().getFullYear() +
// // // // //       "-" +
// // // // //       Date.now();

// // // // //     order.invoiceGenerated = true;
// // // // //     order.invoiceNumber = invoiceNumber;
// // // // //     order.invoiceGeneratedAt = new Date();

// // // // //     await order.save();

// // // // //     res.status(200).json({
// // // // //       success: true,
// // // // //       message: "Invoice generated successfully",
// // // // //       invoiceNumber,
// // // // //       invoiceGeneratedAt: order.invoiceGeneratedAt,
// // // // //       order,
// // // // //     });

// // // // //   } catch (error) {
// // // // //     console.error("Generate invoice error:", error);

// // // // //     res.status(500).json({
// // // // //       success: false,
// // // // //       message: error.message,
// // // // //     });
// // // // //   }
// // // // // };


// // // // // // ========================================
// // // // // // Get Invoice
// // // // // // ========================================
// // // // // exports.getInvoice = async (req, res) => {
// // // // //   try {
// // // // //     const { orderId } = req.params;

// // // // //     const order = await Order.findById(orderId)
// // // // //       .populate("user", "fullName phone email");

// // // // //     if (!order) {
// // // // //       return res.status(404).json({
// // // // //         success: false,
// // // // //         message: "Order not found",
// // // // //       });
// // // // //     }

// // // // //     // Get products/order items
// // // // //     const items = await OrderItem.find({
// // // // //       order: order._id,
// // // // //     }).populate("product", "name");

// // // // //     res.status(200).json({
// // // // //       success: true,

// // // // //       invoice: {
// // // // //         invoiceNumber: order.invoiceNumber,
// // // // //         invoiceGenerated: order.invoiceGenerated,
// // // // //         invoiceGeneratedAt: order.invoiceGeneratedAt,

// // // // //         orderNumber: order.orderNumber,
// // // // //         orderDate: order.placedAt,

// // // // //         customer: order.user,

// // // // //         shippingAddress: order.shippingAddress,

// // // // //         items,

// // // // //         subtotal: order.subtotal,
// // // // //         discount: order.discount,
// // // // //         deliveryFee: order.deliveryFee,
// // // // //         tax: order.tax,
// // // // //         totalAmount: order.totalAmount,

// // // // //         paymentMethod: order.paymentMethod,
// // // // //         paymentStatus: order.paymentStatus,

// // // // //         orderStatus: order.orderStatus,
// // // // //       },
// // // // //     });

// // // // //   } catch (error) {
// // // // //     console.error("Get invoice error:", error);

// // // // //     res.status(500).json({
// // // // //       success: false,
// // // // //       message: error.message,
// // // // //     });
// // // // //   }
// // // // // };

// // // // const Order = require("../models/Order");
// // // // const OrderItem = require("../models/OrderItem");
// // // // const PDFDocument = require("pdfkit");

// // // // // ========================================
// // // // // Generate Invoice
// // // // // ========================================
// // // // exports.generateInvoice = async (req, res) => {
// // // //   try {
// // // //     const { orderId } = req.params;

// // // //     const order = await Order.findById(orderId)
// // // //       .populate("user", "fullName phone email");

// // // //     if (!order) {
// // // //       return res.status(404).json({
// // // //         success: false,
// // // //         message: "Order not found",
// // // //       });
// // // //     }

// // // //     // Get order items
// // // //     const items = await OrderItem.find({
// // // //       order: order._id,
// // // //     }).populate("product", "name price");

// // // //     // Invoice already generated
// // // //     if (order.invoiceGenerated && order.invoiceNumber) {
// // // //       return res.status(200).json({
// // // //         success: true,
// // // //         message: "Invoice already generated",
// // // //         invoiceNumber: order.invoiceNumber,
// // // //         invoiceGeneratedAt: order.invoiceGeneratedAt,
// // // //         order,
// // // //         items,
// // // //       });
// // // //     }

// // // //     // Generate invoice number
// // // //     const invoiceNumber =
// // // //       "INV-" +
// // // //       new Date().getFullYear() +
// // // //       "-" +
// // // //       Date.now();

// // // //     order.invoiceGenerated = true;
// // // //     order.invoiceNumber = invoiceNumber;
// // // //     order.invoiceGeneratedAt = new Date();

// // // //     await order.save();

// // // //     res.status(200).json({
// // // //       success: true,
// // // //       message: "Invoice generated successfully",
// // // //       invoiceNumber,
// // // //       invoiceGeneratedAt: order.invoiceGeneratedAt,
// // // //       order,
// // // //       items,
// // // //     });

// // // //   } catch (error) {
// // // //     console.error("Generate invoice error:", error);

// // // //     res.status(500).json({
// // // //       success: false,
// // // //       message: error.message,
// // // //     });
// // // //   }
// // // // };


// // // // // ========================================
// // // // // Get Invoice PDF
// // // // // ========================================
// // // // exports.getInvoice = async (req, res) => {
// // // //   try {
// // // //     const { orderId } = req.params;

// // // //     console.log("📄 Creating invoice PDF for:", orderId);

// // // //     const order = await Order.findById(orderId)
// // // //       .populate("user", "fullName phone email");

// // // //     if (!order) {
// // // //       return res.status(404).json({
// // // //         success: false,
// // // //         message: "Order not found",
// // // //       });
// // // //     }

// // // //     // Get order items
// // // //     const items = await OrderItem.find({
// // // //       order: order._id,
// // // //     }).populate("product", "name price");

// // // //     // Invoice must be generated first
// // // //     if (!order.invoiceGenerated || !order.invoiceNumber) {
// // // //       return res.status(400).json({
// // // //         success: false,
// // // //         message: "Invoice has not been generated for this order",
// // // //       });
// // // //     }

// // // //     // ========================================
// // // //     // Create PDF
// // // //     // ========================================

// // // //     const doc = new PDFDocument({
// // // //       size: "A4",
// // // //       margin: 50,
// // // //     });

// // // //     const fileName = `${order.invoiceNumber}.pdf`;

// // // //     res.setHeader("Content-Type", "application/pdf");
// // // //     res.setHeader(
// // // //       "Content-Disposition",
// // // //       `inline; filename="${fileName}"`
// // // //     );

// // // //     // Send PDF directly to browser
// // // //     doc.pipe(res);

// // // //     // ========================================
// // // //     // HEADER
// // // //     // ========================================

// // // //     doc
// // // //       .fontSize(24)
// // // //       .font("Helvetica-Bold")
// // // //       .text("RudraGroceries", {
// // // //         align: "left",
// // // //       });

// // // //     doc
// // // //       .fontSize(10)
// // // //       .font("Helvetica")
// // // //       .text("Grocery E-Commerce Store");

// // // //     doc.moveDown(1);

// // // //     doc
// // // //       .fontSize(20)
// // // //       .font("Helvetica-Bold")
// // // //       .text("INVOICE", {
// // // //         align: "right",
// // // //       });

// // // //     doc.moveDown(0.5);

// // // //     // ========================================
// // // //     // INVOICE INFORMATION
// // // //     // ========================================

// // // //     doc
// // // //       .fontSize(10)
// // // //       .font("Helvetica")
// // // //       .text(`Invoice Number: ${order.invoiceNumber}`, {
// // // //         align: "right",
// // // //       });

// // // //     doc.text(
// // // //       `Invoice Date: ${formatDate(order.invoiceGeneratedAt)}`,
// // // //       {
// // // //         align: "right",
// // // //       }
// // // //     );

// // // //     doc.text(`Order Number: ${order.orderNumber}`, {
// // // //       align: "right",
// // // //     });

// // // //     doc.text(
// // // //       `Order Date: ${formatDate(order.placedAt || order.createdAt)}`,
// // // //       {
// // // //         align: "right",
// // // //       }
// // // //     );

// // // //     doc.moveDown(2);

// // // //     // ========================================
// // // //     // CUSTOMER + SHIPPING ADDRESS
// // // //     // ========================================

// // // //     const customer = order.user || {};
// // // //     const address = order.shippingAddress || {};

// // // //     doc
// // // //       .fontSize(12)
// // // //       .font("Helvetica-Bold")
// // // //       .text("Bill To:");

// // // //     doc
// // // //       .fontSize(10)
// // // //       .font("Helvetica")
// // // //       .text(customer.fullName || address.fullName || "-");

// // // //     if (customer.phone || address.phone) {
// // // //       doc.text(`Phone: ${customer.phone || address.phone}`);
// // // //     }

// // // //     if (customer.email) {
// // // //       doc.text(`Email: ${customer.email}`);
// // // //     }

// // // //     doc.moveDown(1);

// // // //     doc
// // // //       .fontSize(12)
// // // //       .font("Helvetica-Bold")
// // // //       .text("Shipping Address:");

// // // //     doc
// // // //       .fontSize(10)
// // // //       .font("Helvetica")
// // // //       .text(address.address || "-");

// // // //     doc.text(
// // // //       `${address.city || ""}, ${address.state || ""} - ${
// // // //         address.pincode || ""
// // // //       }`
// // // //     );

// // // //     doc.moveDown(2);

// // // //     // ========================================
// // // //     // PRODUCTS TABLE
// // // //     // ========================================

// // // //     doc
// // // //       .fontSize(12)
// // // //       .font("Helvetica-Bold")
// // // //       .text("Order Items");

// // // //     doc.moveDown(0.5);

// // // //     // Table header
// // // //     const tableTop = doc.y;

// // // //     doc
// // // //       .fontSize(10)
// // // //       .font("Helvetica-Bold")
// // // //       .text("Product", 50, tableTop, {
// // // //         width: 230,
// // // //       });

// // // //     doc.text("Qty", 290, tableTop, {
// // // //       width: 50,
// // // //       align: "center",
// // // //     });

// // // //     doc.text("Price", 350, tableTop, {
// // // //       width: 80,
// // // //       align: "right",
// // // //     });

// // // //     doc.text("Amount", 440, tableTop, {
// // // //       width: 100,
// // // //       align: "right",
// // // //     });

// // // //     doc.moveTo(50, tableTop + 18)
// // // //       .lineTo(550, tableTop + 18)
// // // //       .stroke();

// // // //     let y = tableTop + 28;

// // // //     // ========================================
// // // //     // ITEMS
// // // //     // ========================================

// // // //     items.forEach((item) => {
// // // //       const productName =
// // // //         item.product?.name ||
// // // //         item.name ||
// // // //         "Product";

// // // //       const quantity =
// // // //         item.quantity ||
// // // //         item.qty ||
// // // //         1;

// // // //       const price =
// // // //         item.price ??
// // // //         item.unitPrice ??
// // // //         item.product?.price ??
// // // //         0;

// // // //       const amount =
// // // //         item.total ??
// // // //         item.totalPrice ??
// // // //         price * quantity;

// // // //       doc
// // // //         .fontSize(10)
// // // //         .font("Helvetica")
// // // //         .text(productName, 50, y, {
// // // //           width: 230,
// // // //         });

// // // //       doc.text(String(quantity), 290, y, {
// // // //         width: 50,
// // // //         align: "center",
// // // //       });

// // // //       doc.text(`₹${Number(price).toFixed(2)}`, 350, y, {
// // // //         width: 80,
// // // //         align: "right",
// // // //       });

// // // //       doc.text(`₹${Number(amount).toFixed(2)}`, 440, y, {
// // // //         width: 100,
// // // //         align: "right",
// // // //       });

// // // //       y += 25;
// // // //     });

// // // //     doc.moveTo(50, y)
// // // //       .lineTo(550, y)
// // // //       .stroke();

// // // //     y += 20;

// // // //     // ========================================
// // // //     // TOTALS
// // // //     // ========================================

// // // //     const subtotal = Number(order.subtotal || 0);
// // // //     const discount = Number(order.discount || 0);
// // // //     const deliveryFee = Number(order.deliveryFee || 0);
// // // //     const tax = Number(order.tax || 0);
// // // //     const totalAmount = Number(order.totalAmount || 0);

// // // //     doc
// // // //       .fontSize(10)
// // // //       .font("Helvetica")
// // // //       .text("Subtotal:", 350, y, {
// // // //         width: 100,
// // // //         align: "right",
// // // //       });

// // // //     doc.text(`₹${subtotal.toFixed(2)}`, 450, y, {
// // // //       width: 100,
// // // //       align: "right",
// // // //     });

// // // //     y += 20;

// // // //     doc.text("Discount:", 350, y, {
// // // //       width: 100,
// // // //       align: "right",
// // // //     });

// // // //     doc.text(`₹${discount.toFixed(2)}`, 450, y, {
// // // //       width: 100,
// // // //       align: "right",
// // // //     });

// // // //     y += 20;

// // // //     doc.text("Delivery Fee:", 350, y, {
// // // //       width: 100,
// // // //       align: "right",
// // // //     });

// // // //     doc.text(`₹${deliveryFee.toFixed(2)}`, 450, y, {
// // // //       width: 100,
// // // //       align: "right",
// // // //     });

// // // //     y += 20;

// // // //     doc.text("Tax:", 350, y, {
// // // //       width: 100,
// // // //       align: "right",
// // // //     });

// // // //     doc.text(`₹${tax.toFixed(2)}`, 450, y, {
// // // //       width: 100,
// // // //       align: "right",
// // // //     });

// // // //     y += 25;

// // // //     doc
// // // //       .fontSize(13)
// // // //       .font("Helvetica-Bold")
// // // //       .text("Total Amount:", 330, y, {
// // // //         width: 120,
// // // //         align: "right",
// // // //       });

// // // //     doc.text(`₹${totalAmount.toFixed(2)}`, 450, y, {
// // // //       width: 100,
// // // //       align: "right",
// // // //     });

// // // //     y += 40;

// // // //     // ========================================
// // // //     // PAYMENT DETAILS
// // // //     // ========================================

// // // //     doc
// // // //       .fontSize(12)
// // // //       .font("Helvetica-Bold")
// // // //       .text("Payment Details", 50, y);

// // // //     y += 20;

// // // //     doc
// // // //       .fontSize(10)
// // // //       .font("Helvetica")
// // // //       .text(
// // // //         `Payment Method: ${formatPaymentMethod(
// // // //           order.paymentMethod
// // // //         )}`,
// // // //         50,
// // // //         y
// // // //       );

// // // //     y += 18;

// // // //     doc.text(
// // // //       `Payment Status: ${formatPaymentStatus(
// // // //         order.paymentStatus
// // // //       )}`,
// // // //       50,
// // // //       y
// // // //     );

// // // //     y += 18;

// // // //     doc.text(
// // // //       `Order Status: ${formatOrderStatus(
// // // //         order.orderStatus
// // // //       )}`,
// // // //       50,
// // // //       y
// // // //     );

// // // //     // ========================================
// // // //     // FOOTER
// // // //     // ========================================

// // // //     doc
// // // //       .fontSize(9)
// // // //       .font("Helvetica")
// // // //       .text(
// // // //         "Thank you for shopping with RudraGroceries!",
// // // //         50,
// // // //         750,
// // // //         {
// // // //           align: "center",
// // // //           width: 500,
// // // //         }
// // // //       );

// // // //     doc.text(
// // // //       "This is a computer-generated invoice.",
// // // //       50,
// // // //       765,
// // // //       {
// // // //         align: "center",
// // // //         width: 500,
// // // //       }
// // // //     );

// // // //     // Finish PDF
// // // //     doc.end();

// // // //   } catch (error) {
// // // //     console.error("❌ Get invoice PDF error:", error);

// // // //     if (!res.headersSent) {
// // // //       return res.status(500).json({
// // // //         success: false,
// // // //         message: error.message,
// // // //       });
// // // //     }
// // // //   }
// // // // };


// // // // // ========================================
// // // // // Get Invoice JSON Data
// // // // // ========================================
// // // // exports.getInvoiceByOrder = async (req, res) => {
// // // //   try {
// // // //     const { orderId } = req.params;

// // // //     const order = await Order.findById(orderId)
// // // //       .populate("user", "fullName phone email");

// // // //     if (!order) {
// // // //       return res.status(404).json({
// // // //         success: false,
// // // //         message: "Order not found",
// // // //       });
// // // //     }

// // // //     const items = await OrderItem.find({
// // // //       order: order._id,
// // // //     }).populate("product", "name price");

// // // //     res.status(200).json({
// // // //       success: true,

// // // //       invoice: {
// // // //         invoiceNumber: order.invoiceNumber,
// // // //         invoiceGenerated: order.invoiceGenerated,
// // // //         invoiceGeneratedAt: order.invoiceGeneratedAt,

// // // //         orderNumber: order.orderNumber,
// // // //         orderDate: order.placedAt,

// // // //         customer: order.user,

// // // //         shippingAddress: order.shippingAddress,

// // // //         items,

// // // //         subtotal: order.subtotal,
// // // //         discount: order.discount,
// // // //         deliveryFee: order.deliveryFee,
// // // //         tax: order.tax,
// // // //         totalAmount: order.totalAmount,

// // // //         paymentMethod: order.paymentMethod,
// // // //         paymentStatus: order.paymentStatus,

// // // //         orderStatus: order.orderStatus,
// // // //       },
// // // //     });

// // // //   } catch (error) {
// // // //     console.error("Get invoice data error:", error);

// // // //     res.status(500).json({
// // // //       success: false,
// // // //       message: error.message,
// // // //     });
// // // //   }
// // // // };


// // // // // ========================================
// // // // // Download Invoice PDF
// // // // // ========================================
// // // // exports.downloadInvoice = async (req, res) => {
// // // //   try {
// // // //     const { orderId } = req.params;

// // // //     const order = await Order.findById(orderId)
// // // //       .populate("user", "fullName phone email");

// // // //     if (!order) {
// // // //       return res.status(404).json({
// // // //         success: false,
// // // //         message: "Order not found",
// // // //       });
// // // //     }

// // // //     if (!order.invoiceGenerated || !order.invoiceNumber) {
// // // //       return res.status(400).json({
// // // //         success: false,
// // // //         message: "Invoice has not been generated",
// // // //       });
// // // //     }

// // // //     const items = await OrderItem.find({
// // // //       order: order._id,
// // // //     }).populate("product", "name price");

// // // //     const doc = new PDFDocument({
// // // //       size: "A4",
// // // //       margin: 50,
// // // //     });

// // // //     const fileName = `${order.invoiceNumber}.pdf`;

// // // //     res.setHeader("Content-Type", "application/pdf");

// // // //     res.setHeader(
// // // //       "Content-Disposition",
// // // //       `attachment; filename="${fileName}"`
// // // //     );

// // // //     doc.pipe(res);

// // // //     // Reuse invoice PDF content
// // // //     createInvoiceContent(doc, order, items);

// // // //     doc.end();

// // // //   } catch (error) {
// // // //     console.error("❌ Download invoice error:", error);

// // // //     if (!res.headersSent) {
// // // //       res.status(500).json({
// // // //         success: false,
// // // //         message: error.message,
// // // //       });
// // // //     }
// // // //   }
// // // // };


// // // // // controllers/invoiceController.js

// // // // // ========================================
// // // // // Get All Invoices
// // // // // ========================================
// // // // exports.getAllInvoices = async (req, res) => {
// // // //   try {
// // // //     // ✅ Find all orders with invoices
// // // //     const invoices = await Order.find({
// // // //       invoiceGenerated: true,
// // // //     })
// // // //       .populate("user", "fullName phone email")
// // // //       .sort({ invoiceGeneratedAt: -1 });

// // // //     // ✅ If no invoices found, return empty array
// // // //     res.status(200).json({
// // // //       success: true,
// // // //       count: invoices.length,
// // // //       invoices: invoices,
// // // //     });

// // // //   } catch (error) {
// // // //     console.error("❌ Get all invoices error:", error);
    
// // // //     res.status(500).json({
// // // //       success: false,
// // // //       message: error.message,
// // // //     });
// // // //   }
// // // // };

// // // // // ========================================
// // // // // Helper: Create Invoice Content
// // // // // ========================================
// // // // function createInvoiceContent(doc, order, items) {

// // // //   doc
// // // //     .fontSize(24)
// // // //     .font("Helvetica-Bold")
// // // //     .text("RudraGroceries");

// // // //   doc
// // // //     .fontSize(10)
// // // //     .font("Helvetica")
// // // //     .text("Grocery E-Commerce Store");

// // // //   doc.moveDown(1);

// // // //   doc
// // // //     .fontSize(20)
// // // //     .font("Helvetica-Bold")
// // // //     .text("INVOICE", {
// // // //       align: "right",
// // // //     });

// // // //   doc.moveDown(0.5);

// // // //   doc
// // // //     .fontSize(10)
// // // //     .font("Helvetica")
// // // //     .text(`Invoice Number: ${order.invoiceNumber}`, {
// // // //       align: "right",
// // // //     });

// // // //   doc.text(
// // // //     `Invoice Date: ${formatDate(order.invoiceGeneratedAt)}`,
// // // //     {
// // // //       align: "right",
// // // //     }
// // // //   );

// // // //   doc.text(`Order Number: ${order.orderNumber}`, {
// // // //     align: "right",
// // // //   });

// // // //   doc.text(
// // // //     `Order Date: ${formatDate(order.placedAt || order.createdAt)}`,
// // // //     {
// // // //       align: "right",
// // // //     }
// // // //   );

// // // //   doc.moveDown(2);

// // // //   const customer = order.user || {};
// // // //   const address = order.shippingAddress || {};

// // // //   doc
// // // //     .fontSize(12)
// // // //     .font("Helvetica-Bold")
// // // //     .text("Bill To:");

// // // //   doc
// // // //     .fontSize(10)
// // // //     .font("Helvetica")
// // // //     .text(customer.fullName || address.fullName || "-");

// // // //   doc.text(`Phone: ${customer.phone || address.phone || "-"}`);

// // // //   if (customer.email) {
// // // //     doc.text(`Email: ${customer.email}`);
// // // //   }

// // // //   doc.moveDown(1);

// // // //   doc
// // // //     .fontSize(12)
// // // //     .font("Helvetica-Bold")
// // // //     .text("Shipping Address:");

// // // //   doc
// // // //     .fontSize(10)
// // // //     .font("Helvetica")
// // // //     .text(address.address || "-");

// // // //   doc.text(
// // // //     `${address.city || ""}, ${address.state || ""} - ${
// // // //       address.pincode || ""
// // // //     }`
// // // //   );

// // // //   doc.moveDown(2);

// // // //   doc
// // // //     .fontSize(12)
// // // //     .font("Helvetica-Bold")
// // // //     .text("Order Items");

// // // //   doc.moveDown(0.5);

// // // //   const tableTop = doc.y;

// // // //   doc
// // // //     .fontSize(10)
// // // //     .font("Helvetica-Bold")
// // // //     .text("Product", 50, tableTop, {
// // // //       width: 230,
// // // //     });

// // // //   doc.text("Qty", 290, tableTop, {
// // // //     width: 50,
// // // //     align: "center",
// // // //   });

// // // //   doc.text("Price", 350, tableTop, {
// // // //     width: 80,
// // // //     align: "right",
// // // //   });

// // // //   doc.text("Amount", 440, tableTop, {
// // // //     width: 100,
// // // //     align: "right",
// // // //   });

// // // //   doc.moveTo(50, tableTop + 18)
// // // //     .lineTo(550, tableTop + 18)
// // // //     .stroke();

// // // //   let y = tableTop + 28;

// // // //   items.forEach((item) => {

// // // //     const productName =
// // // //       item.product?.name ||
// // // //       item.name ||
// // // //       "Product";

// // // //     const quantity =
// // // //       item.quantity ||
// // // //       item.qty ||
// // // //       1;

// // // //     const price =
// // // //       item.price ??
// // // //       item.unitPrice ??
// // // //       item.product?.price ??
// // // //       0;

// // // //     const amount =
// // // //       item.total ??
// // // //       item.totalPrice ??
// // // //       price * quantity;

// // // //     doc
// // // //       .fontSize(10)
// // // //       .font("Helvetica")
// // // //       .text(productName, 50, y, {
// // // //         width: 230,
// // // //       });

// // // //     doc.text(String(quantity), 290, y, {
// // // //       width: 50,
// // // //       align: "center",
// // // //     });

// // // //     doc.text(`₹${Number(price).toFixed(2)}`, 350, y, {
// // // //       width: 80,
// // // //       align: "right",
// // // //     });

// // // //     doc.text(`₹${Number(amount).toFixed(2)}`, 440, y, {
// // // //       width: 100,
// // // //       align: "right",
// // // //     });

// // // //     y += 25;
// // // //   });

// // // //   doc.moveTo(50, y)
// // // //     .lineTo(550, y)
// // // //     .stroke();

// // // //   y += 20;

// // // //   const subtotal = Number(order.subtotal || 0);
// // // //   const discount = Number(order.discount || 0);
// // // //   const deliveryFee = Number(order.deliveryFee || 0);
// // // //   const tax = Number(order.tax || 0);
// // // //   const totalAmount = Number(order.totalAmount || 0);

// // // //   doc
// // // //     .fontSize(10)
// // // //     .font("Helvetica")
// // // //     .text("Subtotal:", 350, y, {
// // // //       width: 100,
// // // //       align: "right",
// // // //     });

// // // //   doc.text(`₹${subtotal.toFixed(2)}`, 450, y, {
// // // //     width: 100,
// // // //     align: "right",
// // // //   });

// // // //   y += 20;

// // // //   doc.text("Discount:", 350, y, {
// // // //     width: 100,
// // // //     align: "right",
// // // //   });

// // // //   doc.text(`₹${discount.toFixed(2)}`, 450, y, {
// // // //     width: 100,
// // // //     align: "right",
// // // //   });

// // // //   y += 20;

// // // //   doc.text("Delivery Fee:", 350, y, {
// // // //     width: 100,
// // // //     align: "right",
// // // //   });

// // // //   doc.text(`₹${deliveryFee.toFixed(2)}`, 450, y, {
// // // //     width: 100,
// // // //     align: "right",
// // // //   });

// // // //   y += 20;

// // // //   doc.text("Tax:", 350, y, {
// // // //     width: 100,
// // // //     align: "right",
// // // //   });

// // // //   doc.text(`₹${tax.toFixed(2)}`, 450, y, {
// // // //     width: 100,
// // // //     align: "right",
// // // //   });

// // // //   y += 25;

// // // //   doc
// // // //     .fontSize(13)
// // // //     .font("Helvetica-Bold")
// // // //     .text("Total Amount:", 330, y, {
// // // //       width: 120,
// // // //       align: "right",
// // // //     });

// // // //   doc.text(`₹${totalAmount.toFixed(2)}`, 450, y, {
// // // //     width: 100,
// // // //     align: "right",
// // // //   });

// // // //   y += 40;

// // // //   doc
// // // //     .fontSize(12)
// // // //     .font("Helvetica-Bold")
// // // //     .text("Payment Details", 50, y);

// // // //   y += 20;

// // // //   doc
// // // //     .fontSize(10)
// // // //     .font("Helvetica")
// // // //     .text(
// // // //       `Payment Method: ${formatPaymentMethod(
// // // //         order.paymentMethod
// // // //       )}`,
// // // //       50,
// // // //       y
// // // //     );

// // // //   y += 18;

// // // //   doc.text(
// // // //     `Payment Status: ${formatPaymentStatus(
// // // //       order.paymentStatus
// // // //     )}`,
// // // //     50,
// // // //     y
// // // //   );

// // // //   y += 18;

// // // //   doc.text(
// // // //     `Order Status: ${formatOrderStatus(
// // // //       order.orderStatus
// // // //     )}`,
// // // //     50,
// // // //     y
// // // //   );

// // // //   doc
// // // //     .fontSize(9)
// // // //     .text(
// // // //       "Thank you for shopping with RudraGroceries!",
// // // //       50,
// // // //       750,
// // // //       {
// // // //         align: "center",
// // // //         width: 500,
// // // //       }
// // // //     );

// // // //   doc.text(
// // // //     "This is a computer-generated invoice.",
// // // //     50,
// // // //     765,
// // // //     {
// // // //       align: "center",
// // // //       width: 500,
// // // //     }
// // // //   );
// // // // }


// // // // // ========================================
// // // // // Helper Functions
// // // // // ========================================

// // // // function formatDate(date) {
// // // //   if (!date) return "-";

// // // //   return new Date(date).toLocaleString("en-IN", {
// // // //     day: "2-digit",
// // // //     month: "short",
// // // //     year: "numeric",
// // // //     hour: "2-digit",
// // // //     minute: "2-digit",
// // // //   });
// // // // }

// // // // function formatPaymentMethod(method) {
// // // //   if (!method) return "-";

// // // //   return String(method)
// // // //     .replace(/_/g, " ")
// // // //     .toUpperCase();
// // // // }

// // // // function formatPaymentStatus(status) {
// // // //   if (!status) return "-";

// // // //   return String(status)
// // // //     .replace(/_/g, " ")
// // // //     .replace(/\b\w/g, (char) => char.toUpperCase());
// // // // }

// // // // function formatOrderStatus(status) {
// // // //   if (!status) return "-";

// // // //   return String(status)
// // // //     .replace(/_/g, " ")
// // // //     .replace(/\b\w/g, (char) => char.toUpperCase());
// // // // }

// // // // const Order = require("../models/Order");
// // // // const OrderItem = require("../models/OrderItem");

// // // // // ========================================
// // // // // Generate Invoice
// // // // // ========================================
// // // // exports.generateInvoice = async (req, res) => {
// // // //   try {
// // // //     const { orderId } = req.params;

// // // //     const order = await Order.findById(orderId)
// // // //       .populate("user", "fullName phone email");

// // // //     if (!order) {
// // // //       return res.status(404).json({
// // // //         success: false,
// // // //         message: "Order not found",
// // // //       });
// // // //     }

// // // //     // Invoice already generated
// // // //     if (order.invoiceGenerated && order.invoiceNumber) {
// // // //       return res.status(200).json({
// // // //         success: true,
// // // //         message: "Invoice already generated",
// // // //         invoiceNumber: order.invoiceNumber,
// // // //         invoiceGeneratedAt: order.invoiceGeneratedAt,
// // // //         order,
// // // //       });
// // // //     }

// // // //     // Generate invoice number
// // // //     const invoiceNumber =
// // // //       "INV-" +
// // // //       new Date().getFullYear() +
// // // //       "-" +
// // // //       Date.now();

// // // //     order.invoiceGenerated = true;
// // // //     order.invoiceNumber = invoiceNumber;
// // // //     order.invoiceGeneratedAt = new Date();

// // // //     await order.save();

// // // //     res.status(200).json({
// // // //       success: true,
// // // //       message: "Invoice generated successfully",
// // // //       invoiceNumber,
// // // //       invoiceGeneratedAt: order.invoiceGeneratedAt,
// // // //       order,
// // // //     });

// // // //   } catch (error) {
// // // //     console.error("Generate invoice error:", error);

// // // //     res.status(500).json({
// // // //       success: false,
// // // //       message: error.message,
// // // //     });
// // // //   }
// // // // };


// // // // // ========================================
// // // // // Get Invoice
// // // // // ========================================
// // // // exports.getInvoice = async (req, res) => {
// // // //   try {
// // // //     const { orderId } = req.params;

// // // //     const order = await Order.findById(orderId)
// // // //       .populate("user", "fullName phone email");

// // // //     if (!order) {
// // // //       return res.status(404).json({
// // // //         success: false,
// // // //         message: "Order not found",
// // // //       });
// // // //     }

// // // //     // Get products/order items
// // // //     const items = await OrderItem.find({
// // // //       order: order._id,
// // // //     }).populate("product", "name");

// // // //     res.status(200).json({
// // // //       success: true,

// // // //       invoice: {
// // // //         invoiceNumber: order.invoiceNumber,
// // // //         invoiceGenerated: order.invoiceGenerated,
// // // //         invoiceGeneratedAt: order.invoiceGeneratedAt,

// // // //         orderNumber: order.orderNumber,
// // // //         orderDate: order.placedAt,

// // // //         customer: order.user,

// // // //         shippingAddress: order.shippingAddress,

// // // //         items,

// // // //         subtotal: order.subtotal,
// // // //         discount: order.discount,
// // // //         deliveryFee: order.deliveryFee,
// // // //         tax: order.tax,
// // // //         totalAmount: order.totalAmount,

// // // //         paymentMethod: order.paymentMethod,
// // // //         paymentStatus: order.paymentStatus,

// // // //         orderStatus: order.orderStatus,
// // // //       },
// // // //     });

// // // //   } catch (error) {
// // // //     console.error("Get invoice error:", error);

// // // //     res.status(500).json({
// // // //       success: false,
// // // //       message: error.message,
// // // //     });
// // // //   }
// // // // };

// // // const Order = require("../models/Order");
// // // const OrderItem = require("../models/OrderItem");
// // // const PDFDocument = require("pdfkit");
// // // const archiver = require("archiver");

// // // // ========================================
// // // // Generate Invoice
// // // // ========================================
// // // exports.generateInvoice = async (req, res) => {
// // //   try {
// // //     const { orderId } = req.params;

// // //     const order = await Order.findById(orderId)
// // //       .populate("user", "fullName phone email");

// // //     if (!order) {
// // //       return res.status(404).json({
// // //         success: false,
// // //         message: "Order not found",
// // //       });
// // //     }

// // //     // Get order items
// // //     const items = await OrderItem.find({
// // //       order: order._id,
// // //     }).populate("product", "name price");

// // //     // Invoice already generated
// // //     if (order.invoiceGenerated && order.invoiceNumber) {
// // //       return res.status(200).json({
// // //         success: true,
// // //         message: "Invoice already generated",
// // //         invoiceNumber: order.invoiceNumber,
// // //         invoiceGeneratedAt: order.invoiceGeneratedAt,
// // //         order,
// // //         items,
// // //       });
// // //     }

// // //     // Generate invoice number
// // //     const invoiceNumber =
// // //       "INV-" +
// // //       new Date().getFullYear() +
// // //       "-" +
// // //       Date.now();

// // //     order.invoiceGenerated = true;
// // //     order.invoiceNumber = invoiceNumber;
// // //     order.invoiceGeneratedAt = new Date();

// // //     await order.save();

// // //     res.status(200).json({
// // //       success: true,
// // //       message: "Invoice generated successfully",
// // //       invoiceNumber,
// // //       invoiceGeneratedAt: order.invoiceGeneratedAt,
// // //       order,
// // //       items,
// // //     });

// // //   } catch (error) {
// // //     console.error("Generate invoice error:", error);

// // //     res.status(500).json({
// // //       success: false,
// // //       message: error.message,
// // //     });
// // //   }
// // // };


// // // // ========================================
// // // // Get Invoice PDF
// // // // ========================================
// // // exports.getInvoice = async (req, res) => {
// // //   try {
// // //     const { orderId } = req.params;

// // //     console.log("📄 Creating invoice PDF for:", orderId);

// // //     const order = await Order.findById(orderId)
// // //       .populate("user", "fullName phone email");

// // //     if (!order) {
// // //       return res.status(404).json({
// // //         success: false,
// // //         message: "Order not found",
// // //       });
// // //     }

// // //     // Get order items
// // //     const items = await OrderItem.find({
// // //       order: order._id,
// // //     }).populate("product", "name price");

// // //     // Invoice must be generated first
// // //     if (!order.invoiceGenerated || !order.invoiceNumber) {
// // //       return res.status(400).json({
// // //         success: false,
// // //         message: "Invoice has not been generated for this order",
// // //       });
// // //     }

// // //     // ========================================
// // //     // Create PDF
// // //     // ========================================

// // //     const doc = new PDFDocument({
// // //       size: "A4",
// // //       margin: 50,
// // //     });

// // //     const fileName = `${order.invoiceNumber}.pdf`;

// // //     res.setHeader("Content-Type", "application/pdf");
// // //     res.setHeader(
// // //       "Content-Disposition",
// // //       `inline; filename="${fileName}"`
// // //     );

// // //     // Send PDF directly to browser
// // //     doc.pipe(res);

// // //     // ========================================
// // //     // HEADER
// // //     // ========================================

// // //     doc
// // //       .fontSize(24)
// // //       .font("Helvetica-Bold")
// // //       .text("RudraGroceries", {
// // //         align: "left",
// // //       });

// // //     doc
// // //       .fontSize(10)
// // //       .font("Helvetica")
// // //       .text("Grocery E-Commerce Store");

// // //     doc.moveDown(1);

// // //     doc
// // //       .fontSize(20)
// // //       .font("Helvetica-Bold")
// // //       .text("INVOICE", {
// // //         align: "right",
// // //       });

// // //     doc.moveDown(0.5);

// // //     // ========================================
// // //     // INVOICE INFORMATION
// // //     // ========================================

// // //     doc
// // //       .fontSize(10)
// // //       .font("Helvetica")
// // //       .text(`Invoice Number: ${order.invoiceNumber}`, {
// // //         align: "right",
// // //       });

// // //     doc.text(
// // //       `Invoice Date: ${formatDate(order.invoiceGeneratedAt)}`,
// // //       {
// // //         align: "right",
// // //       }
// // //     );

// // //     doc.text(`Order Number: ${order.orderNumber}`, {
// // //       align: "right",
// // //     });

// // //     doc.text(
// // //       `Order Date: ${formatDate(order.placedAt || order.createdAt)}`,
// // //       {
// // //         align: "right",
// // //       }
// // //     );

// // //     doc.moveDown(2);

// // //     // ========================================
// // //     // CUSTOMER + SHIPPING ADDRESS
// // //     // ========================================

// // //     const customer = order.user || {};
// // //     const address = order.shippingAddress || {};

// // //     doc
// // //       .fontSize(12)
// // //       .font("Helvetica-Bold")
// // //       .text("Bill To:");

// // //     doc
// // //       .fontSize(10)
// // //       .font("Helvetica")
// // //       .text(customer.fullName || address.fullName || "-");

// // //     if (customer.phone || address.phone) {
// // //       doc.text(`Phone: ${customer.phone || address.phone}`);
// // //     }

// // //     if (customer.email) {
// // //       doc.text(`Email: ${customer.email}`);
// // //     }

// // //     doc.moveDown(1);

// // //     doc
// // //       .fontSize(12)
// // //       .font("Helvetica-Bold")
// // //       .text("Shipping Address:");

// // //     doc
// // //       .fontSize(10)
// // //       .font("Helvetica")
// // //       .text(address.address || "-");

// // //     doc.text(
// // //       `${address.city || ""}, ${address.state || ""} - ${
// // //         address.pincode || ""
// // //       }`
// // //     );

// // //     doc.moveDown(2);

// // //     // ========================================
// // //     // PRODUCTS TABLE
// // //     // ========================================

// // //     doc
// // //       .fontSize(12)
// // //       .font("Helvetica-Bold")
// // //       .text("Order Items");

// // //     doc.moveDown(0.5);

// // //     // Table header
// // //     const tableTop = doc.y;

// // //     doc
// // //       .fontSize(10)
// // //       .font("Helvetica-Bold")
// // //       .text("Product", 50, tableTop, {
// // //         width: 230,
// // //       });

// // //     doc.text("Qty", 290, tableTop, {
// // //       width: 50,
// // //       align: "center",
// // //     });

// // //     doc.text("Price", 350, tableTop, {
// // //       width: 80,
// // //       align: "right",
// // //     });

// // //     doc.text("Amount", 440, tableTop, {
// // //       width: 100,
// // //       align: "right",
// // //     });

// // //     doc.moveTo(50, tableTop + 18)
// // //       .lineTo(550, tableTop + 18)
// // //       .stroke();

// // //     let y = tableTop + 28;

// // //     // ========================================
// // //     // ITEMS
// // //     // ========================================

// // //     items.forEach((item) => {
// // //       const productName =
// // //         item.product?.name ||
// // //         item.name ||
// // //         "Product";

// // //       const quantity =
// // //         item.quantity ||
// // //         item.qty ||
// // //         1;

// // //       const price =
// // //         item.price ??
// // //         item.unitPrice ??
// // //         item.product?.price ??
// // //         0;

// // //       const amount =
// // //         item.total ??
// // //         item.totalPrice ??
// // //         price * quantity;

// // //       doc
// // //         .fontSize(10)
// // //         .font("Helvetica")
// // //         .text(productName, 50, y, {
// // //           width: 230,
// // //         });

// // //       doc.text(String(quantity), 290, y, {
// // //         width: 50,
// // //         align: "center",
// // //       });

// // //       doc.text(`₹${Number(price).toFixed(2)}`, 350, y, {
// // //         width: 80,
// // //         align: "right",
// // //       });

// // //       doc.text(`₹${Number(amount).toFixed(2)}`, 440, y, {
// // //         width: 100,
// // //         align: "right",
// // //       });

// // //       y += 25;
// // //     });

// // //     doc.moveTo(50, y)
// // //       .lineTo(550, y)
// // //       .stroke();

// // //     y += 20;

// // //     // ========================================
// // //     // TOTALS
// // //     // ========================================

// // //     const subtotal = Number(order.subtotal || 0);
// // //     const discount = Number(order.discount || 0);
// // //     const deliveryFee = Number(order.deliveryFee || 0);
// // //     const tax = Number(order.tax || 0);
// // //     const totalAmount = Number(order.totalAmount || 0);

// // //     doc
// // //       .fontSize(10)
// // //       .font("Helvetica")
// // //       .text("Subtotal:", 350, y, {
// // //         width: 100,
// // //         align: "right",
// // //       });

// // //     doc.text(`₹${subtotal.toFixed(2)}`, 450, y, {
// // //       width: 100,
// // //       align: "right",
// // //     });

// // //     y += 20;

// // //     doc.text("Discount:", 350, y, {
// // //       width: 100,
// // //       align: "right",
// // //     });

// // //     doc.text(`₹${discount.toFixed(2)}`, 450, y, {
// // //       width: 100,
// // //       align: "right",
// // //     });

// // //     y += 20;

// // //     doc.text("Delivery Fee:", 350, y, {
// // //       width: 100,
// // //       align: "right",
// // //     });

// // //     doc.text(`₹${deliveryFee.toFixed(2)}`, 450, y, {
// // //       width: 100,
// // //       align: "right",
// // //     });

// // //     y += 20;

// // //     doc.text("Tax:", 350, y, {
// // //       width: 100,
// // //       align: "right",
// // //     });

// // //     doc.text(`₹${tax.toFixed(2)}`, 450, y, {
// // //       width: 100,
// // //       align: "right",
// // //     });

// // //     y += 25;

// // //     doc
// // //       .fontSize(13)
// // //       .font("Helvetica-Bold")
// // //       .text("Total Amount:", 330, y, {
// // //         width: 120,
// // //         align: "right",
// // //       });

// // //     doc.text(`₹${totalAmount.toFixed(2)}`, 450, y, {
// // //       width: 100,
// // //       align: "right",
// // //     });

// // //     y += 40;

// // //     // ========================================
// // //     // PAYMENT DETAILS
// // //     // ========================================

// // //     doc
// // //       .fontSize(12)
// // //       .font("Helvetica-Bold")
// // //       .text("Payment Details", 50, y);

// // //     y += 20;

// // //     doc
// // //       .fontSize(10)
// // //       .font("Helvetica")
// // //       .text(
// // //         `Payment Method: ${formatPaymentMethod(
// // //           order.paymentMethod
// // //         )}`,
// // //         50,
// // //         y
// // //       );

// // //     y += 18;

// // //     doc.text(
// // //       `Payment Status: ${formatPaymentStatus(
// // //         order.paymentStatus
// // //       )}`,
// // //       50,
// // //       y
// // //     );

// // //     y += 18;

// // //     doc.text(
// // //       `Order Status: ${formatOrderStatus(
// // //         order.orderStatus
// // //       )}`,
// // //       50,
// // //       y
// // //     );

// // //     // ========================================
// // //     // FOOTER
// // //     // ========================================

// // //     doc
// // //       .fontSize(9)
// // //       .font("Helvetica")
// // //       .text(
// // //         "Thank you for shopping with RudraGroceries!",
// // //         50,
// // //         750,
// // //         {
// // //           align: "center",
// // //           width: 500,
// // //         }
// // //       );

// // //     doc.text(
// // //       "This is a computer-generated invoice.",
// // //       50,
// // //       765,
// // //       {
// // //         align: "center",
// // //         width: 500,
// // //       }
// // //     );

// // //     // Finish PDF
// // //     doc.end();

// // //   } catch (error) {
// // //     console.error("❌ Get invoice PDF error:", error);

// // //     if (!res.headersSent) {
// // //       return res.status(500).json({
// // //         success: false,
// // //         message: error.message,
// // //       });
// // //     }
// // //   }
// // // };


// // // // ========================================
// // // // Get Invoice JSON Data
// // // // ========================================
// // // exports.getInvoiceByOrder = async (req, res) => {
// // //   try {
// // //     const { orderId } = req.params;

// // //     const order = await Order.findById(orderId)
// // //       .populate("user", "fullName phone email");

// // //     if (!order) {
// // //       return res.status(404).json({
// // //         success: false,
// // //         message: "Order not found",
// // //       });
// // //     }

// // //     const items = await OrderItem.find({
// // //       order: order._id,
// // //     }).populate("product", "name price");

// // //     res.status(200).json({
// // //       success: true,

// // //       invoice: {
// // //         invoiceNumber: order.invoiceNumber,
// // //         invoiceGenerated: order.invoiceGenerated,
// // //         invoiceGeneratedAt: order.invoiceGeneratedAt,

// // //         orderNumber: order.orderNumber,
// // //         orderDate: order.placedAt,

// // //         customer: order.user,

// // //         shippingAddress: order.shippingAddress,

// // //         items,

// // //         subtotal: order.subtotal,
// // //         discount: order.discount,
// // //         deliveryFee: order.deliveryFee,
// // //         tax: order.tax,
// // //         totalAmount: order.totalAmount,

// // //         paymentMethod: order.paymentMethod,
// // //         paymentStatus: order.paymentStatus,

// // //         orderStatus: order.orderStatus,
// // //       },
// // //     });

// // //   } catch (error) {
// // //     console.error("Get invoice data error:", error);

// // //     res.status(500).json({
// // //       success: false,
// // //       message: error.message,
// // //     });
// // //   }
// // // };


// // // // ========================================
// // // // Download Invoice PDF
// // // // ========================================
// // // exports.downloadInvoice = async (req, res) => {
// // //   try {
// // //     const { orderId } = req.params;

// // //     const order = await Order.findById(orderId)
// // //       .populate("user", "fullName phone email");

// // //     if (!order) {
// // //       return res.status(404).json({
// // //         success: false,
// // //         message: "Order not found",
// // //       });
// // //     }

// // //     if (!order.invoiceGenerated || !order.invoiceNumber) {
// // //       return res.status(400).json({
// // //         success: false,
// // //         message: "Invoice has not been generated",
// // //       });
// // //     }

// // //     const items = await OrderItem.find({
// // //       order: order._id,
// // //     }).populate("product", "name price");

// // //     const doc = new PDFDocument({
// // //       size: "A4",
// // //       margin: 50,
// // //     });

// // //     const fileName = `${order.invoiceNumber}.pdf`;

// // //     res.setHeader("Content-Type", "application/pdf");

// // //     res.setHeader(
// // //       "Content-Disposition",
// // //       `attachment; filename="${fileName}"`
// // //     );

// // //     doc.pipe(res);

// // //     // Reuse invoice PDF content
// // //     createInvoiceContent(doc, order, items);

// // //     doc.end();

// // //   } catch (error) {
// // //     console.error("❌ Download invoice error:", error);

// // //     if (!res.headersSent) {
// // //       res.status(500).json({
// // //         success: false,
// // //         message: error.message,
// // //       });
// // //     }
// // //   }
// // // };


// // // // controllers/invoiceController.js

// // // // ========================================
// // // // Get All Invoices (with customer name search)
// // // // ========================================
// // // exports.getAllInvoices = async (req, res) => {
// // //   try {
// // //     const { search } = req.query;

// // //     // ✅ Find all orders with invoices
// // //     let invoices = await Order.find({
// // //       invoiceGenerated: true,
// // //     })
// // //       .populate("user", "fullName phone email")
// // //       .sort({ invoiceGeneratedAt: -1 });

// // //     // ✅ Search by customer name / order number / invoice number
// // //     if (search && search.trim()) {
// // //       const term = search.trim().toLowerCase();

// // //       invoices = invoices.filter((inv) => {
// // //         const customerName =
// // //           inv.user?.fullName ||
// // //           inv.shippingAddress?.fullName ||
// // //           "";

// // //         return (
// // //           customerName.toLowerCase().includes(term) ||
// // //           (inv.invoiceNumber || "").toLowerCase().includes(term) ||
// // //           (inv.orderNumber || "").toLowerCase().includes(term) ||
// // //           (inv.user?.phone || "").toLowerCase().includes(term) ||
// // //           (inv.user?.email || "").toLowerCase().includes(term)
// // //         );
// // //       });
// // //     }

// // //     res.status(200).json({
// // //       success: true,
// // //       count: invoices.length,
// // //       invoices: invoices,
// // //     });

// // //   } catch (error) {
// // //     console.error("❌ Get all invoices error:", error);
    
// // //     res.status(500).json({
// // //       success: false,
// // //       message: error.message,
// // //     });
// // //   }
// // // };


// // // // ========================================
// // // // Generate Invoices for ALL / FILTERED Customers/Orders
// // // // (bulk-generates invoices for every order that doesn't
// // // //  have one yet, optionally narrowed by filters)
// // // //
// // // // Accepts filters via query string OR request body:
// // // //   customerId   - only orders for this user (Mongo _id)
// // // //   orderStatus  - "placed" | "confirmed" | "packed" | "out_for_delivery" | "delivered" | "cancelled"
// // // //   search       - matches orderNumber or customer fullName (case-insensitive)
// // // //   dateFrom     - ISO date string, filters on placedAt >=
// // // //   dateTo       - ISO date string, filters on placedAt <=
// // // //   onlyPending  - "false" to (re)generate even for orders that already
// // // //                  have an invoice (defaults to true = only pending ones)
// // // // ========================================
// // // exports.generateAllInvoices = async (req, res) => {
// // //   try {
// // //     const {
// // //       customerId,
// // //       orderStatus,
// // //       search,
// // //       dateFrom,
// // //       dateTo,
// // //       onlyPending,
// // //     } = { ...req.query, ...req.body };

// // //     const filter = {};

// // //     // ✅ By default only generate for orders that don't have one yet
// // //     if (onlyPending !== "false") {
// // //       filter.$or = [
// // //         { invoiceGenerated: { $ne: true } },
// // //         { invoiceGenerated: { $exists: false } },
// // //       ];
// // //     }

// // //     if (customerId) {
// // //       filter.user = customerId;
// // //     }

// // //     if (orderStatus && orderStatus !== "all") {
// // //       filter.orderStatus = orderStatus;
// // //     }

// // //     if (dateFrom || dateTo) {
// // //       filter.placedAt = {};
// // //       if (dateFrom) filter.placedAt.$gte = new Date(dateFrom);
// // //       if (dateTo) filter.placedAt.$lte = new Date(dateTo);
// // //     }

// // //     // ✅ Pull matching orders first, then apply text search on
// // //     // populated customer name (can't $regex a populated field directly)
// // //     let pendingOrders = await Order.find(filter)
// // //       .populate("user", "fullName phone email");

// // //     if (search && search.trim()) {
// // //       const term = search.trim().toLowerCase();
// // //       pendingOrders = pendingOrders.filter((o) => {
// // //         const customerName =
// // //           o.user?.fullName || o.shippingAddress?.fullName || "";
// // //         return (
// // //           (o.orderNumber || "").toLowerCase().includes(term) ||
// // //           customerName.toLowerCase().includes(term)
// // //         );
// // //       });
// // //     }

// // //     if (!pendingOrders.length) {
// // //       return res.status(200).json({
// // //         success: true,
// // //         message: "No matching orders found for the selected filters.",
// // //         generatedCount: 0,
// // //         invoices: [],
// // //       });
// // //     }

// // //     const generated = [];

// // //     for (let i = 0; i < pendingOrders.length; i++) {
// // //       const order = pendingOrders[i];

// // //       // Unique invoice number per order (year + timestamp + index)
// // //       const invoiceNumber =
// // //         "INV-" +
// // //         new Date().getFullYear() +
// // //         "-" +
// // //         Date.now() +
// // //         "-" +
// // //         i;

// // //       order.invoiceGenerated = true;
// // //       order.invoiceNumber = invoiceNumber;
// // //       order.invoiceGeneratedAt = new Date();

// // //       await order.save();

// // //       generated.push({
// // //         orderId: order._id,
// // //         orderNumber: order.orderNumber,
// // //         customer: order.user?.fullName || order.shippingAddress?.fullName || "N/A",
// // //         invoiceNumber,
// // //         invoiceGeneratedAt: order.invoiceGeneratedAt,
// // //       });
// // //     }

// // //     res.status(200).json({
// // //       success: true,
// // //       message: `Generated ${generated.length} invoice(s) successfully`,
// // //       generatedCount: generated.length,
// // //       invoices: generated,
// // //     });

// // //   } catch (error) {
// // //     console.error("❌ Generate all invoices error:", error);

// // //     res.status(500).json({
// // //       success: false,
// // //       message: error.message,
// // //     });
// // //   }
// // // };
// // // // ========================================
// // // // Download Filtered Invoices as ONE PDF
// // // // ========================================
// // // exports.downloadAllInvoices = async (req, res) => {
// // //   try {
// // //     const { invoiceIds = [] } = req.body;

// // //     if (!Array.isArray(invoiceIds) || invoiceIds.length === 0) {
// // //       return res.status(400).json({
// // //         success: false,
// // //         message: "No invoices selected for download",
// // //       });
// // //     }

// // //     // Get only filtered invoices selected by frontend
// // //     const invoices = await Order.find({
// // //       _id: { $in: invoiceIds },
// // //       invoiceGenerated: true,
// // //     })
// // //       .populate("user", "fullName phone email")
// // //       .sort({ invoiceGeneratedAt: -1 });

// // //     if (!invoices.length) {
// // //       return res.status(404).json({
// // //         success: false,
// // //         message: "No invoices found",
// // //       });
// // //     }

// // //     // Get items for every invoice
// // //     const invoicesWithItems = await Promise.all(
// // //       invoices.map(async (order) => {
// // //         const items = await OrderItem.find({
// // //           order: order._id,
// // //         }).populate("product", "name price");

// // //         return {
// // //           order,
// // //           items,
// // //         };
// // //       })
// // //     );

// // //     // ========================================
// // //     // Create ONE PDF
// // //     // ========================================

// // //     const doc = new PDFDocument({
// // //       size: "A4",
// // //       margin: 50,
// // //       autoFirstPage: true,
// // //     });

// // //     const fileName = `RudraGroceries-Invoices-${new Date()
// // //       .toISOString()
// // //       .slice(0, 10)}.pdf`;

// // //     res.setHeader("Content-Type", "application/pdf");

// // //     res.setHeader(
// // //       "Content-Disposition",
// // //       `attachment; filename="${fileName}"`
// // //     );

// // //     doc.pipe(res);

// // //     // ========================================
// // //     // Add every invoice as separate page
// // //     // ========================================

// // //     invoicesWithItems.forEach(({ order, items }, index) => {
// // //       if (index > 0) {
// // //         doc.addPage();
// // //       }

// // //       createInvoiceContent(doc, order, items);
// // //     });

// // //     // Finish PDF
// // //     doc.end();

// // //   } catch (error) {
// // //     console.error("❌ Download filtered invoices error:", error);

// // //     if (!res.headersSent) {
// // //       return res.status(500).json({
// // //         success: false,
// // //         message: error.message,
// // //       });
// // //     }
// // //   }
// // // };
// // // // ========================================
// // // // Download ALL / FILTERED Invoices as a ZIP
// // // // ========================================
// // // // Supports the same filters as generateAllInvoices, via query string:
// // // //   customerId, orderStatus, search, dateFrom, dateTo
// // // // Only orders that already have a generated invoice are included.
// // // exports.downloadAllInvoices = async (req, res) => {
// // //   try {
// // //     const { customerId, orderStatus, search, dateFrom, dateTo } = req.query;

// // //     const filter = { invoiceGenerated: true };

// // //     if (customerId) filter.user = customerId;
// // //     if (orderStatus && orderStatus !== "all") filter.orderStatus = orderStatus;

// // //     if (dateFrom || dateTo) {
// // //       filter.placedAt = {};
// // //       if (dateFrom) filter.placedAt.$gte = new Date(dateFrom);
// // //       if (dateTo) filter.placedAt.$lte = new Date(dateTo);
// // //     }

// // //     let orders = await Order.find(filter)
// // //       .populate("user", "fullName phone email")
// // //       .sort({ invoiceGeneratedAt: -1 });

// // //     if (search && search.trim()) {
// // //       const term = search.trim().toLowerCase();
// // //       orders = orders.filter((o) => {
// // //         const customerName = o.user?.fullName || o.shippingAddress?.fullName || "";
// // //         return (
// // //           (o.invoiceNumber || "").toLowerCase().includes(term) ||
// // //           (o.orderNumber || "").toLowerCase().includes(term) ||
// // //           customerName.toLowerCase().includes(term)
// // //         );
// // //       });
// // //     }

// // //     if (!orders.length) {
// // //       return res.status(404).json({
// // //         success: false,
// // //         message: "No generated invoices found for the selected filters.",
// // //       });
// // //     }

// // //     // ✅ Set headers BEFORE piping so the browser treats this as a file download
// // //     res.setHeader("Content-Type", "application/zip");
// // //     res.setHeader(
// // //       "Content-Disposition",
// // //       `attachment; filename="Invoices-${Date.now()}.zip"`
// // //     );

// // //     const archive = archiver("zip", { zlib: { level: 9 } });

// // //     archive.on("error", (err) => {
// // //       console.error("❌ Archive error:", err);
// // //       if (!res.headersSent) {
// // //         res.status(500).json({ success: false, message: err.message });
// // //       }
// // //     });

// // //     archive.pipe(res);

// // //     // ✅ Build each order's PDF in memory, then append it to the zip
// // //     for (const order of orders) {
// // //       const items = await OrderItem.find({ order: order._id }).populate(
// // //         "product",
// // //         "name price"
// // //       );

// // //       const doc = new PDFDocument({ size: "A4", margin: 50 });
// // //       const chunks = [];

// // //       doc.on("data", (chunk) => chunks.push(chunk));

// // //       const pdfDone = new Promise((resolve) => {
// // //         doc.on("end", () => resolve(Buffer.concat(chunks)));
// // //       });

// // //       createInvoiceContent(doc, order, items);
// // //       doc.end();

// // //       const pdfBuffer = await pdfDone;
// // //       const safeName = (order.invoiceNumber || order.orderNumber || order._id.toString()) + ".pdf";

// // //       archive.append(pdfBuffer, { name: safeName });
// // //     }

// // //     await archive.finalize();

// // //   } catch (error) {
// // //     console.error("❌ Download all invoices error:", error);

// // //     if (!res.headersSent) {
// // //       res.status(500).json({
// // //         success: false,
// // //         message: error.message,
// // //       });
// // //     }
// // //   }
// // // };


// // // // ========================================
// // // // Helper: Create Invoice Content
// // // // ========================================
// // // function createInvoiceContent(doc, order, items) {

// // //   doc
// // //     .fontSize(24)
// // //     .font("Helvetica-Bold")
// // //     .text("RudraGroceries");

// // //   doc
// // //     .fontSize(10)
// // //     .font("Helvetica")
// // //     .text("Grocery E-Commerce Store");

// // //   doc.moveDown(1);

// // //   doc
// // //     .fontSize(20)
// // //     .font("Helvetica-Bold")
// // //     .text("INVOICE", {
// // //       align: "right",
// // //     });

// // //   doc.moveDown(0.5);

// // //   doc
// // //     .fontSize(10)
// // //     .font("Helvetica")
// // //     .text(`Invoice Number: ${order.invoiceNumber}`, {
// // //       align: "right",
// // //     });

// // //   doc.text(
// // //     `Invoice Date: ${formatDate(order.invoiceGeneratedAt)}`,
// // //     {
// // //       align: "right",
// // //     }
// // //   );

// // //   doc.text(`Order Number: ${order.orderNumber}`, {
// // //     align: "right",
// // //   });

// // //   doc.text(
// // //     `Order Date: ${formatDate(order.placedAt || order.createdAt)}`,
// // //     {
// // //       align: "right",
// // //     }
// // //   );

// // //   doc.moveDown(2);

// // //   const customer = order.user || {};
// // //   const address = order.shippingAddress || {};

// // //   doc
// // //     .fontSize(12)
// // //     .font("Helvetica-Bold")
// // //     .text("Bill To:");

// // //   doc
// // //     .fontSize(10)
// // //     .font("Helvetica")
// // //     .text(customer.fullName || address.fullName || "-");

// // //   doc.text(`Phone: ${customer.phone || address.phone || "-"}`);

// // //   if (customer.email) {
// // //     doc.text(`Email: ${customer.email}`);
// // //   }

// // //   doc.moveDown(1);

// // //   doc
// // //     .fontSize(12)
// // //     .font("Helvetica-Bold")
// // //     .text("Shipping Address:");

// // //   doc
// // //     .fontSize(10)
// // //     .font("Helvetica")
// // //     .text(address.address || "-");

// // //   doc.text(
// // //     `${address.city || ""}, ${address.state || ""} - ${
// // //       address.pincode || ""
// // //     }`
// // //   );

// // //   doc.moveDown(2);

// // //   doc
// // //     .fontSize(12)
// // //     .font("Helvetica-Bold")
// // //     .text("Order Items");

// // //   doc.moveDown(0.5);

// // //   const tableTop = doc.y;

// // //   doc
// // //     .fontSize(10)
// // //     .font("Helvetica-Bold")
// // //     .text("Product", 50, tableTop, {
// // //       width: 230,
// // //     });

// // //   doc.text("Qty", 290, tableTop, {
// // //     width: 50,
// // //     align: "center",
// // //   });

// // //   doc.text("Price", 350, tableTop, {
// // //     width: 80,
// // //     align: "right",
// // //   });

// // //   doc.text("Amount", 440, tableTop, {
// // //     width: 100,
// // //     align: "right",
// // //   });

// // //   doc.moveTo(50, tableTop + 18)
// // //     .lineTo(550, tableTop + 18)
// // //     .stroke();

// // //   let y = tableTop + 28;

// // //   items.forEach((item) => {

// // //     const productName =
// // //       item.product?.name ||
// // //       item.name ||
// // //       "Product";

// // //     const quantity =
// // //       item.quantity ||
// // //       item.qty ||
// // //       1;

// // //     const price =
// // //       item.price ??
// // //       item.unitPrice ??
// // //       item.product?.price ??
// // //       0;

// // //     const amount =
// // //       item.total ??
// // //       item.totalPrice ??
// // //       price * quantity;

// // //     doc
// // //       .fontSize(10)
// // //       .font("Helvetica")
// // //       .text(productName, 50, y, {
// // //         width: 230,
// // //       });

// // //     doc.text(String(quantity), 290, y, {
// // //       width: 50,
// // //       align: "center",
// // //     });

// // //     doc.text(`₹${Number(price).toFixed(2)}`, 350, y, {
// // //       width: 80,
// // //       align: "right",
// // //     });

// // //     doc.text(`₹${Number(amount).toFixed(2)}`, 440, y, {
// // //       width: 100,
// // //       align: "right",
// // //     });

// // //     y += 25;
// // //   });

// // //   doc.moveTo(50, y)
// // //     .lineTo(550, y)
// // //     .stroke();

// // //   y += 20;

// // //   const subtotal = Number(order.subtotal || 0);
// // //   const discount = Number(order.discount || 0);
// // //   const deliveryFee = Number(order.deliveryFee || 0);
// // //   const tax = Number(order.tax || 0);
// // //   const totalAmount = Number(order.totalAmount || 0);

// // //   doc
// // //     .fontSize(10)
// // //     .font("Helvetica")
// // //     .text("Subtotal:", 350, y, {
// // //       width: 100,
// // //       align: "right",
// // //     });

// // //   doc.text(`₹${subtotal.toFixed(2)}`, 450, y, {
// // //     width: 100,
// // //     align: "right",
// // //   });

// // //   y += 20;

// // //   doc.text("Discount:", 350, y, {
// // //     width: 100,
// // //     align: "right",
// // //   });

// // //   doc.text(`₹${discount.toFixed(2)}`, 450, y, {
// // //     width: 100,
// // //     align: "right",
// // //   });

// // //   y += 20;

// // //   doc.text("Delivery Fee:", 350, y, {
// // //     width: 100,
// // //     align: "right",
// // //   });

// // //   doc.text(`₹${deliveryFee.toFixed(2)}`, 450, y, {
// // //     width: 100,
// // //     align: "right",
// // //   });

// // //   y += 20;

// // //   doc.text("Tax:", 350, y, {
// // //     width: 100,
// // //     align: "right",
// // //   });

// // //   doc.text(`₹${tax.toFixed(2)}`, 450, y, {
// // //     width: 100,
// // //     align: "right",
// // //   });

// // //   y += 25;

// // //   doc
// // //     .fontSize(13)
// // //     .font("Helvetica-Bold")
// // //     .text("Total Amount:", 330, y, {
// // //       width: 120,
// // //       align: "right",
// // //     });

// // //   doc.text(`₹${totalAmount.toFixed(2)}`, 450, y, {
// // //     width: 100,
// // //     align: "right",
// // //   });

// // //   y += 40;

// // //   doc
// // //     .fontSize(12)
// // //     .font("Helvetica-Bold")
// // //     .text("Payment Details", 50, y);

// // //   y += 20;

// // //   doc
// // //     .fontSize(10)
// // //     .font("Helvetica")
// // //     .text(
// // //       `Payment Method: ${formatPaymentMethod(
// // //         order.paymentMethod
// // //       )}`,
// // //       50,
// // //       y
// // //     );

// // //   y += 18;

// // //   doc.text(
// // //     `Payment Status: ${formatPaymentStatus(
// // //       order.paymentStatus
// // //     )}`,
// // //     50,
// // //     y
// // //   );

// // //   y += 18;

// // //   doc.text(
// // //     `Order Status: ${formatOrderStatus(
// // //       order.orderStatus
// // //     )}`,
// // //     50,
// // //     y
// // //   );

// // //   doc
// // //     .fontSize(9)
// // //     .text(
// // //       "Thank you for shopping with RudraGroceries!",
// // //       50,
// // //       750,
// // //       {
// // //         align: "center",
// // //         width: 500,
// // //       }
// // //     );

// // //   doc.text(
// // //     "This is a computer-generated invoice.",
// // //     50,
// // //     765,
// // //     {
// // //       align: "center",
// // //       width: 500,
// // //     }
// // //   );
// // // }


// // // // ========================================
// // // // Helper Functions
// // // // ========================================

// // // function formatDate(date) {
// // //   if (!date) return "-";

// // //   return new Date(date).toLocaleString("en-IN", {
// // //     day: "2-digit",
// // //     month: "short",
// // //     year: "numeric",
// // //     hour: "2-digit",
// // //     minute: "2-digit",
// // //   });
// // // }

// // // function formatPaymentMethod(method) {
// // //   if (!method) return "-";

// // //   return String(method)
// // //     .replace(/_/g, " ")
// // //     .toUpperCase();
// // // }

// // // function formatPaymentStatus(status) {
// // //   if (!status) return "-";

// // //   return String(status)
// // //     .replace(/_/g, " ")
// // //     .replace(/\b\w/g, (char) => char.toUpperCase());
// // // }

// // // function formatOrderStatus(status) {
// // //   if (!status) return "-";

// // //   return String(status)
// // //     .replace(/_/g, " ")
// // //     .replace(/\b\w/g, (char) => char.toUpperCase());
// // // }

// // const Order = require("../models/Order");
// // const OrderItem = require("../models/OrderItem");
// // const PDFDocument = require("pdfkit");

// // // ========================================
// // // Generate Invoice
// // // ========================================
// // exports.generateInvoice = async (req, res) => {
// //   try {
// //     const { orderId } = req.params;

// //     const order = await Order.findById(orderId).populate(
// //       "user",
// //       "fullName phone email"
// //     );

// //     if (!order) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Order not found",
// //       });
// //     }

// //     // Get order items
// //     const items = await OrderItem.find({
// //       order: order._id,
// //     }).populate("product", "name price");

// //     // Invoice already generated
// //     if (order.invoiceGenerated && order.invoiceNumber) {
// //       return res.status(200).json({
// //         success: true,
// //         message: "Invoice already generated",
// //         invoiceNumber: order.invoiceNumber,
// //         invoiceGeneratedAt: order.invoiceGeneratedAt,
// //         order,
// //         items,
// //       });
// //     }

// //     // Generate invoice number
// //     const invoiceNumber =
// //       "INV-" +
// //       new Date().getFullYear() +
// //       "-" +
// //       Date.now();

// //     order.invoiceGenerated = true;
// //     order.invoiceNumber = invoiceNumber;
// //     order.invoiceGeneratedAt = new Date();

// //     await order.save();

// //     return res.status(200).json({
// //       success: true,
// //       message: "Invoice generated successfully",
// //       invoiceNumber,
// //       invoiceGeneratedAt: order.invoiceGeneratedAt,
// //       order,
// //       items,
// //     });
// //   } catch (error) {
// //     console.error("Generate invoice error:", error);

// //     return res.status(500).json({
// //       success: false,
// //       message: error.message,
// //     });
// //   }
// // };

// // // ========================================
// // // Preview Invoice PDF
// // // ========================================
// // exports.getInvoice = async (req, res) => {
// //   try {
// //     const { orderId } = req.params;

// //     console.log("Creating invoice PDF for:", orderId);

// //     const order = await Order.findById(orderId).populate(
// //       "user",
// //       "fullName phone email"
// //     );

// //     if (!order) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Order not found",
// //       });
// //     }

// //     const items = await OrderItem.find({
// //       order: order._id,
// //     }).populate("product", "name price");

// //     if (!order.invoiceGenerated || !order.invoiceNumber) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Invoice has not been generated for this order",
// //       });
// //     }

// //     const doc = new PDFDocument({
// //       size: "A4",
// //       margin: 50,
// //     });

// //     const fileName = `${order.invoiceNumber}.pdf`;

// //     res.setHeader("Content-Type", "application/pdf");
// //     res.setHeader(
// //       "Content-Disposition",
// //       `inline; filename="${fileName}"`
// //     );

// //     doc.pipe(res);

// //     createInvoiceContent(doc, order, items);

// //     doc.end();
// //   } catch (error) {
// //     console.error("Get invoice PDF error:", error);

// //     if (!res.headersSent) {
// //       return res.status(500).json({
// //         success: false,
// //         message: error.message,
// //       });
// //     }
// //   }
// // };

// // // ========================================
// // // Get Invoice JSON Data
// // // ========================================
// // exports.getInvoiceByOrder = async (req, res) => {
// //   try {
// //     const { orderId } = req.params;

// //     const order = await Order.findById(orderId).populate(
// //       "user",
// //       "fullName phone email"
// //     );

// //     if (!order) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Order not found",
// //       });
// //     }

// //     const items = await OrderItem.find({
// //       order: order._id,
// //     }).populate("product", "name price");

// //     return res.status(200).json({
// //       success: true,

// //       invoice: {
// //         invoiceNumber: order.invoiceNumber,
// //         invoiceGenerated: order.invoiceGenerated,
// //         invoiceGeneratedAt: order.invoiceGeneratedAt,

// //         orderNumber: order.orderNumber,
// //         orderDate: order.placedAt || order.createdAt,

// //         customer: order.user,

// //         shippingAddress: order.shippingAddress,

// //         items,

// //         subtotal: order.subtotal,
// //         discount: order.discount,
// //         deliveryFee: order.deliveryFee,
// //         tax: order.tax,
// //         totalAmount: order.totalAmount,

// //         paymentMethod: order.paymentMethod,
// //         paymentStatus: order.paymentStatus,

// //         orderStatus: order.orderStatus,
// //       },
// //     });
// //   } catch (error) {
// //     console.error("Get invoice data error:", error);

// //     return res.status(500).json({
// //       success: false,
// //       message: error.message,
// //     });
// //   }
// // };

// // // ========================================
// // // Download Single Invoice PDF
// // // ========================================
// // exports.downloadInvoice = async (req, res) => {
// //   try {
// //     const { orderId } = req.params;

// //     const order = await Order.findById(orderId).populate(
// //       "user",
// //       "fullName phone email"
// //     );

// //     if (!order) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Order not found",
// //       });
// //     }

// //     if (!order.invoiceGenerated || !order.invoiceNumber) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Invoice has not been generated",
// //       });
// //     }

// //     const items = await OrderItem.find({
// //       order: order._id,
// //     }).populate("product", "name price");

// //     const doc = new PDFDocument({
// //       size: "A4",
// //       margin: 50,
// //     });

// //     const fileName = `${order.invoiceNumber}.pdf`;

// //     res.setHeader("Content-Type", "application/pdf");

// //     res.setHeader(
// //       "Content-Disposition",
// //       `attachment; filename="${fileName}"`
// //     );

// //     doc.pipe(res);

// //     createInvoiceContent(doc, order, items);

// //     doc.end();
// //   } catch (error) {
// //     console.error("Download invoice error:", error);

// //     if (!res.headersSent) {
// //       return res.status(500).json({
// //         success: false,
// //         message: error.message,
// //       });
// //     }
// //   }
// // };

// // // ========================================
// // // Get All Invoices
// // // ========================================
// // exports.getAllInvoices = async (req, res) => {
// //   try {
// //     const { search } = req.query;

// //     let invoices = await Order.find({
// //       invoiceGenerated: true,
// //     })
// //       .populate("user", "fullName phone email")
// //       .sort({
// //         invoiceGeneratedAt: -1,
// //       });

// //     // Search
// //     if (search && search.trim()) {
// //       const term = search.trim().toLowerCase();

// //       invoices = invoices.filter((invoice) => {
// //         const customerName =
// //           invoice.user?.fullName ||
// //           invoice.shippingAddress?.fullName ||
// //           "";

// //         const phone = invoice.user?.phone || "";
// //         const email = invoice.user?.email || "";

// //         return (
// //           customerName.toLowerCase().includes(term) ||
// //           (invoice.invoiceNumber || "")
// //             .toLowerCase()
// //             .includes(term) ||
// //           (invoice.orderNumber || "")
// //             .toLowerCase()
// //             .includes(term) ||
// //           phone.toLowerCase().includes(term) ||
// //           email.toLowerCase().includes(term)
// //         );
// //       });
// //     }

// //     return res.status(200).json({
// //       success: true,
// //       count: invoices.length,
// //       invoices,
// //     });
// //   } catch (error) {
// //     console.error("Get all invoices error:", error);

// //     return res.status(500).json({
// //       success: false,
// //       message: error.message,
// //     });
// //   }
// // };

// // // ========================================
// // // Generate All / Filtered Invoices
// // // ========================================
// // exports.generateAllInvoices = async (req, res) => {
// //   try {
// //     const {
// //       customerId,
// //       orderStatus,
// //       search,
// //       dateFrom,
// //       dateTo,
// //       onlyPending,
// //     } = {
// //       ...req.query,
// //       ...req.body,
// //     };

// //     const filter = {};

// //     // By default only orders without invoices
// //     if (onlyPending !== "false") {
// //       filter.$or = [
// //         {
// //           invoiceGenerated: {
// //             $ne: true,
// //           },
// //         },
// //         {
// //           invoiceGenerated: {
// //             $exists: false,
// //           },
// //         },
// //       ];
// //     }

// //     // Customer
// //     if (customerId && customerId !== "all") {
// //       filter.user = customerId;
// //     }

// //     // Order status
// //     if (orderStatus && orderStatus !== "all") {
// //       filter.orderStatus = orderStatus;
// //     }

// //     // Date filter
// //     if (dateFrom || dateTo) {
// //       filter.placedAt = {};

// //       if (dateFrom) {
// //         filter.placedAt.$gte = new Date(dateFrom);
// //       }

// //       if (dateTo) {
// //         filter.placedAt.$lte = new Date(dateTo);
// //       }
// //     }

// //     let orders = await Order.find(filter).populate(
// //       "user",
// //       "fullName phone email"
// //     );

// //     // Search populated customer
// //     if (search && search.trim()) {
// //       const term = search.trim().toLowerCase();

// //       orders = orders.filter((order) => {
// //         const customerName =
// //           order.user?.fullName ||
// //           order.shippingAddress?.fullName ||
// //           "";

// //         return (
// //           (order.orderNumber || "")
// //             .toLowerCase()
// //             .includes(term) ||
// //           customerName.toLowerCase().includes(term)
// //         );
// //       });
// //     }

// //     if (!orders.length) {
// //       return res.status(200).json({
// //         success: true,
// //         message:
// //           "No matching orders found for the selected filters.",
// //         generatedCount: 0,
// //         invoices: [],
// //       });
// //     }

// //     const generated = [];

// //     for (let i = 0; i < orders.length; i++) {
// //       const order = orders[i];

// //       // Do not generate duplicate invoice
// //       if (
// //         order.invoiceGenerated &&
// //         order.invoiceNumber &&
// //         onlyPending !== "false"
// //       ) {
// //         continue;
// //       }

// //       const invoiceNumber =
// //         "INV-" +
// //         new Date().getFullYear() +
// //         "-" +
// //         Date.now() +
// //         "-" +
// //         i;

// //       order.invoiceGenerated = true;
// //       order.invoiceNumber = invoiceNumber;
// //       order.invoiceGeneratedAt = new Date();

// //       await order.save();

// //       generated.push({
// //         orderId: order._id,
// //         orderNumber: order.orderNumber,
// //         customer:
// //           order.user?.fullName ||
// //           order.shippingAddress?.fullName ||
// //           "N/A",
// //         invoiceNumber,
// //         invoiceGeneratedAt: order.invoiceGeneratedAt,
// //       });
// //     }

// //     return res.status(200).json({
// //       success: true,
// //       message: `Generated ${generated.length} invoice(s) successfully`,
// //       generatedCount: generated.length,
// //       invoices: generated,
// //     });
// //   } catch (error) {
// //     console.error("Generate all invoices error:", error);

// //     return res.status(500).json({
// //       success: false,
// //       message: error.message,
// //     });
// //   }
// // };

// // // ========================================
// // // Download ALL / FILTERED Invoices as ONE PDF
// // // ========================================
// // exports.downloadAllInvoices = async (req, res) => {
// //   try {
// //     /*
// //       Supported filters:

// //       Body:
// //       {
// //         invoiceIds: [],
// //         customerId: "",
// //         orderStatus: "",
// //         status: "",
// //         search: "",
// //         dateFrom: "",
// //         dateTo: ""
// //       }

// //       Query parameters are also supported.
// //     */

// //     const {
// //       invoiceIds,
// //       customerId,
// //       orderStatus,
// //       status,
// //       search,
// //       dateFrom,
// //       dateTo,
// //     } = {
// //       ...req.query,
// //       ...req.body,
// //     };

// //     const filter = {
// //       invoiceGenerated: true,
// //     };

// //     // ========================================
// //     // Invoice IDs
// //     // ========================================
// //     let selectedInvoiceIds = invoiceIds;

// //     if (typeof selectedInvoiceIds === "string") {
// //       try {
// //         selectedInvoiceIds = JSON.parse(selectedInvoiceIds);
// //       } catch (error) {
// //         selectedInvoiceIds = selectedInvoiceIds
// //           .split(",")
// //           .map((id) => id.trim())
// //           .filter(Boolean);
// //       }
// //     }

// //     if (
// //       Array.isArray(selectedInvoiceIds) &&
// //       selectedInvoiceIds.length > 0
// //     ) {
// //       filter._id = {
// //         $in: selectedInvoiceIds,
// //       };
// //     }

// //     // ========================================
// //     // Customer filter
// //     // ========================================
// //     if (customerId && customerId !== "all") {
// //       filter.user = customerId;
// //     }

// //     // ========================================
// //     // Status filter
// //     // ========================================
// //     const selectedStatus = orderStatus || status;

// //     if (
// //       selectedStatus &&
// //       selectedStatus !== "all"
// //     ) {
// //       filter.orderStatus = selectedStatus;
// //     }

// //     // ========================================
// //     // Date filter
// //     // ========================================
// //     if (dateFrom || dateTo) {
// //       filter.placedAt = {};

// //       if (dateFrom) {
// //         filter.placedAt.$gte = new Date(dateFrom);
// //       }

// //       if (dateTo) {
// //         filter.placedAt.$lte = new Date(dateTo);
// //       }
// //     }

// //     // ========================================
// //     // Find invoices
// //     // ========================================
// //     let invoices = await Order.find(filter)
// //       .populate("user", "fullName phone email")
// //       .sort({
// //         invoiceGeneratedAt: -1,
// //       });

// //     // ========================================
// //     // Search
// //     // ========================================
// //     if (search && search.trim()) {
// //       const term = search.trim().toLowerCase();

// //       invoices = invoices.filter((invoice) => {
// //         const customerName =
// //           invoice.user?.fullName ||
// //           invoice.shippingAddress?.fullName ||
// //           "";

// //         const phone = invoice.user?.phone || "";
// //         const email = invoice.user?.email || "";

// //         return (
// //           customerName.toLowerCase().includes(term) ||
// //           (invoice.invoiceNumber || "")
// //             .toLowerCase()
// //             .includes(term) ||
// //           (invoice.orderNumber || "")
// //             .toLowerCase()
// //             .includes(term) ||
// //           phone.toLowerCase().includes(term) ||
// //           email.toLowerCase().includes(term)
// //         );
// //       });
// //     }

// //     // ========================================
// //     // No invoices
// //     // ========================================
// //     if (!invoices.length) {
// //       return res.status(404).json({
// //         success: false,
// //         message:
// //           "No generated invoices found for the selected filters.",
// //       });
// //     }

// //     console.log(
// //       `Generating combined PDF for ${invoices.length} invoice(s)`
// //     );

// //     // ========================================
// //     // Get items
// //     // ========================================
// //     const invoicesWithItems = await Promise.all(
// //       invoices.map(async (order) => {
// //         const items = await OrderItem.find({
// //           order: order._id,
// //         }).populate("product", "name price");

// //         return {
// //           order,
// //           items,
// //         };
// //       })
// //     );

// //     // ========================================
// //     // Create ONE PDF
// //     // ========================================
// //     const doc = new PDFDocument({
// //       size: "A4",
// //       margin: 50,
// //       autoFirstPage: true,
// //     });

// //     const fileName = `RudraGroceries-Invoices-${new Date()
// //       .toISOString()
// //       .slice(0, 10)}.pdf`;

// //     res.setHeader(
// //       "Content-Type",
// //       "application/pdf"
// //     );

// //     res.setHeader(
// //       "Content-Disposition",
// //       `attachment; filename="${fileName}"`
// //     );

// //     // Pipe PDF to response
// //     doc.pipe(res);

// //     // ========================================
// //     // Add each invoice on separate page
// //     // ========================================
// //     invoicesWithItems.forEach(
// //       ({ order, items }, index) => {
// //         if (index > 0) {
// //           doc.addPage();
// //         }

// //         createInvoiceContent(
// //           doc,
// //           order,
// //           items
// //         );
// //       }
// //     );

// //     // Finish PDF
// //     doc.end();
// //   } catch (error) {
// //     console.error(
// //       "Download filtered invoices error:",
// //       error
// //     );

// //     if (!res.headersSent) {
// //       return res.status(500).json({
// //         success: false,
// //         message: error.message,
// //       });
// //     }
// //   }
// // };

// // // ========================================
// // // Helper: Create Invoice PDF Content
// // // ========================================
// // function createInvoiceContent(doc, order, items) {
// //   // ========================================
// //   // Header
// //   // ========================================
// //   doc
// //     .fontSize(24)
// //     .font("Helvetica-Bold")
// //     .text("RudraGroceries");

// //   doc
// //     .fontSize(10)
// //     .font("Helvetica")
// //     .text("Grocery E-Commerce Store");

// //   doc.moveDown(1);

// //   doc
// //     .fontSize(20)
// //     .font("Helvetica-Bold")
// //     .text("INVOICE", {
// //       align: "right",
// //     });

// //   doc.moveDown(0.5);

// //   // ========================================
// //   // Invoice Information
// //   // ========================================
// //   doc
// //     .fontSize(10)
// //     .font("Helvetica")
// //     .text(
// //       `Invoice Number: ${order.invoiceNumber}`,
// //       {
// //         align: "right",
// //       }
// //     );

// //   doc.text(
// //     `Invoice Date: ${formatDate(
// //       order.invoiceGeneratedAt
// //     )}`,
// //     {
// //       align: "right",
// //     }
// //   );

// //   doc.text(
// //     `Order Number: ${order.orderNumber || "-"}`,
// //     {
// //       align: "right",
// //     }
// //   );

// //   doc.text(
// //     `Order Date: ${formatDate(
// //       order.placedAt || order.createdAt
// //     )}`,
// //     {
// //       align: "right",
// //     }
// //   );

// //   doc.moveDown(2);

// //   // ========================================
// //   // Customer
// //   // ========================================
// //   const customer = order.user || {};
// //   const address = order.shippingAddress || {};

// //   doc
// //     .fontSize(12)
// //     .font("Helvetica-Bold")
// //     .text("Bill To:");

// //   doc
// //     .fontSize(10)
// //     .font("Helvetica")
// //     .text(
// //       customer.fullName ||
// //         address.fullName ||
// //         "-"
// //     );

// //   doc.text(
// //     `Phone: ${
// //       customer.phone ||
// //       address.phone ||
// //       "-"
// //     }`
// //   );

// //   if (customer.email) {
// //     doc.text(
// //       `Email: ${customer.email}`
// //     );
// //   }

// //   doc.moveDown(1);

// //   // ========================================
// //   // Shipping Address
// //   // ========================================
// //   doc
// //     .fontSize(12)
// //     .font("Helvetica-Bold")
// //     .text("Shipping Address:");

// //   doc
// //     .fontSize(10)
// //     .font("Helvetica")
// //     .text(
// //       address.address || "-"
// //     );

// //   const cityState = [
// //     address.city,
// //     address.state,
// //   ]
// //     .filter(Boolean)
// //     .join(", ");

// //   if (cityState || address.pincode) {
// //     doc.text(
// //       `${cityState}${
// //         address.pincode
// //           ? ` - ${address.pincode}`
// //           : ""
// //       }`
// //     );
// //   }

// //   doc.moveDown(2);

// //   // ========================================
// //   // Order Items
// //   // ========================================
// //   doc
// //     .fontSize(12)
// //     .font("Helvetica-Bold")
// //     .text("Order Items");

// //   doc.moveDown(0.5);

// //   const tableTop = doc.y;

// //   // Table Header
// //   doc
// //     .fontSize(10)
// //     .font("Helvetica-Bold")
// //     .text(
// //       "Product",
// //       50,
// //       tableTop,
// //       {
// //         width: 230,
// //       }
// //     );

// //   doc.text(
// //     "Qty",
// //     290,
// //     tableTop,
// //     {
// //       width: 50,
// //       align: "center",
// //     }
// //   );

// //   doc.text(
// //     "Price",
// //     350,
// //     tableTop,
// //     {
// //       width: 80,
// //       align: "right",
// //     }
// //   );

// //   doc.text(
// //     "Amount",
// //     440,
// //     tableTop,
// //     {
// //       width: 100,
// //       align: "right",
// //     }
// //   );

// //   doc
// //     .moveTo(50, tableTop + 18)
// //     .lineTo(550, tableTop + 18)
// //     .stroke();

// //   let y = tableTop + 28;

// //   // ========================================
// //   // Items
// //   // ========================================
// //   items.forEach((item) => {
// //     const productName =
// //       item.product?.name ||
// //       item.name ||
// //       "Product";

// //     const quantity =
// //       item.quantity ||
// //       item.qty ||
// //       1;

// //     const price =
// //       item.price ??
// //       item.unitPrice ??
// //       item.product?.price ??
// //       0;

// //     const amount =
// //       item.total ??
// //       item.totalPrice ??
// //       price * quantity;

// //     // Product
// //     doc
// //       .fontSize(10)
// //       .font("Helvetica")
// //       .text(
// //         productName,
// //         50,
// //         y,
// //         {
// //           width: 230,
// //         }
// //       );

// //     // Quantity
// //     doc.text(
// //       String(quantity),
// //       290,
// //       y,
// //       {
// //         width: 50,
// //         align: "center",
// //       }
// //     );

// //     // Price
// //     doc.text(
// //       `Rs. ${Number(price).toFixed(2)}`,
// //       350,
// //       y,
// //       {
// //         width: 80,
// //         align: "right",
// //       }
// //     );

// //     // Amount
// //     doc.text(
// //       `Rs. ${Number(amount).toFixed(2)}`,
// //       440,
// //       y,
// //       {
// //         width: 100,
// //         align: "right",
// //       }
// //     );

// //     y += 25;

// //     // Add page if many products
// //     if (y > 680) {
// //       doc.addPage();
// //       y = 60;
// //     }
// //   });

// //   doc
// //     .moveTo(50, y)
// //     .lineTo(550, y)
// //     .stroke();

// //   y += 20;

// //   // ========================================
// //   // Totals
// //   // ========================================
// //   const subtotal = Number(
// //     order.subtotal || 0
// //   );

// //   const discount = Number(
// //     order.discount || 0
// //   );

// //   const deliveryFee = Number(
// //     order.deliveryFee || 0
// //   );

// //   const tax = Number(
// //     order.tax || 0
// //   );

// //   const totalAmount = Number(
// //     order.totalAmount || 0
// //   );

// //   // Subtotal
// //   doc
// //     .fontSize(10)
// //     .font("Helvetica")
// //     .text(
// //       "Subtotal:",
// //       350,
// //       y,
// //       {
// //         width: 100,
// //         align: "right",
// //       }
// //     );

// //   doc.text(
// //     `Rs. ${subtotal.toFixed(2)}`,
// //     450,
// //     y,
// //     {
// //       width: 100,
// //       align: "right",
// //     }
// //   );

// //   y += 20;

// //   // Discount
// //   doc.text(
// //     "Discount:",
// //     350,
// //     y,
// //     {
// //       width: 100,
// //       align: "right",
// //     }
// //   );

// //   doc.text(
// //     `Rs. ${discount.toFixed(2)}`,
// //     450,
// //     y,
// //     {
// //       width: 100,
// //       align: "right",
// //     }
// //   );

// //   y += 20;

// //   // Delivery
// //   doc.text(
// //     "Delivery Fee:",
// //     350,
// //     y,
// //     {
// //       width: 100,
// //       align: "right",
// //     }
// //   );

// //   doc.text(
// //     `Rs. ${deliveryFee.toFixed(2)}`,
// //     450,
// //     y,
// //     {
// //       width: 100,
// //       align: "right",
// //     }
// //   );

// //   y += 20;

// //   // Tax
// //   doc.text(
// //     "Tax:",
// //     350,
// //     y,
// //     {
// //       width: 100,
// //       align: "right",
// //     }
// //   );

// //   doc.text(
// //     `Rs. ${tax.toFixed(2)}`,
// //     450,
// //     y,
// //     {
// //       width: 100,
// //       align: "right",
// //     }
// //   );

// //   y += 25;

// //   // Total
// //   doc
// //     .fontSize(13)
// //     .font("Helvetica-Bold")
// //     .text(
// //       "Total Amount:",
// //       330,
// //       y,
// //       {
// //         width: 120,
// //         align: "right",
// //       }
// //     );

// //   doc.text(
// //     `Rs. ${totalAmount.toFixed(2)}`,
// //     450,
// //     y,
// //     {
// //       width: 100,
// //       align: "right",
// //     }
// //   );

// //   y += 40;

// //   // ========================================
// //   // Payment Details
// //   // ========================================
// //   doc
// //     .fontSize(12)
// //     .font("Helvetica-Bold")
// //     .text(
// //       "Payment Details",
// //       50,
// //       y
// //     );

// //   y += 20;

// //   doc
// //     .fontSize(10)
// //     .font("Helvetica")
// //     .text(
// //       `Payment Method: ${formatPaymentMethod(
// //         order.paymentMethod
// //       )}`,
// //       50,
// //       y
// //     );

// //   y += 18;

// //   doc.text(
// //     `Payment Status: ${formatPaymentStatus(
// //       order.paymentStatus
// //     )}`,
// //     50,
// //     y
// //   );

// //   y += 18;

// //   doc.text(
// //     `Order Status: ${formatOrderStatus(
// //       order.orderStatus
// //     )}`,
// //     50,
// //     y
// //   );

// //   // ========================================
// //   // Footer
// //   // ========================================
// //   doc
// //     .fontSize(9)
// //     .font("Helvetica")
// //     .text(
// //       "Thank you for shopping with RudraGroceries!",
// //       50,
// //       750,
// //       {
// //         align: "center",
// //         width: 500,
// //       }
// //     );

// //   doc.text(
// //     "This is a computer-generated invoice.",
// //     50,
// //     765,
// //     {
// //       align: "center",
// //       width: 500,
// //     }
// //   );
// // }

// // // ========================================
// // // Helper: Format Date
// // // ========================================
// // function formatDate(date) {
// //   if (!date) {
// //     return "-";
// //   }

// //   return new Date(date).toLocaleString(
// //     "en-IN",
// //     {
// //       day: "2-digit",
// //       month: "short",
// //       year: "numeric",
// //       hour: "2-digit",
// //       minute: "2-digit",
// //     }
// //   );
// // }

// // // ========================================
// // // Helper: Payment Method
// // // ========================================
// // function formatPaymentMethod(method) {
// //   if (!method) {
// //     return "-";
// //   }

// //   return String(method)
// //     .replace(/_/g, " ")
// //     .toUpperCase();
// // }

// // // ========================================
// // // Helper: Payment Status
// // // ========================================
// // function formatPaymentStatus(status) {
// //   if (!status) {
// //     return "-";
// //   }

// //   return String(status)
// //     .replace(/_/g, " ")
// //     .replace(/\b\w/g, (char) =>
// //       char.toUpperCase()
// //     );
// // }

// // // ========================================
// // // Helper: Order Status
// // // ========================================
// // function formatOrderStatus(status) {
// //   if (!status) {
// //     return "-";
// //   }

// //   return String(status)
// //     .replace(/_/g, " ")
// //     .replace(/\b\w/g, (char) =>
// //       char.toUpperCase()
// //     );
// // }

// const Order = require("../models/Order");
// const OrderItem = require("../models/OrderItem");
// const PDFDocument = require("pdfkit");

// // ========================================
// // Generate Invoice
// // ========================================
// exports.generateInvoice = async (req, res) => {
//   try {
//     const { orderId } = req.params;

//     const order = await Order.findById(orderId).populate(
//       "user",
//       "fullName phone email"
//     );

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found",
//       });
//     }

//     // Get order items
//     const items = await OrderItem.find({
//       order: order._id,
//     }).populate("product", "name price");

//     // Invoice already generated
//     if (order.invoiceGenerated && order.invoiceNumber) {
//       return res.status(200).json({
//         success: true,
//         message: "Invoice already generated",
//         invoiceNumber: order.invoiceNumber,
//         invoiceGeneratedAt: order.invoiceGeneratedAt,
//         order,
//         items,
//       });
//     }

//     // Generate invoice number
//     const invoiceNumber =
//       "INV-" +
//       new Date().getFullYear() +
//       "-" +
//       Date.now();

//     order.invoiceGenerated = true;
//     order.invoiceNumber = invoiceNumber;
//     order.invoiceGeneratedAt = new Date();

//     await order.save();

//     return res.status(200).json({
//       success: true,
//       message: "Invoice generated successfully",
//       invoiceNumber,
//       invoiceGeneratedAt: order.invoiceGeneratedAt,
//       order,
//       items,
//     });

//   } catch (error) {
//     console.error("Generate invoice error:", error);

//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ========================================
// // Preview Invoice PDF
// // ========================================
// exports.getInvoice = async (req, res) => {
//   try {
//     const { orderId } = req.params;

//     console.log("Creating invoice PDF for:", orderId);

//     const order = await Order.findById(orderId).populate(
//       "user",
//       "fullName phone email"
//     );

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found",
//       });
//     }

//     const items = await OrderItem.find({
//       order: order._id,
//     }).populate("product", "name price");

//     if (!order.invoiceGenerated || !order.invoiceNumber) {
//       return res.status(400).json({
//         success: false,
//         message: "Invoice has not been generated for this order",
//       });
//     }

//     const doc = new PDFDocument({
//       size: "A4",
//       margin: 50,
//     });

//     const fileName = `${order.invoiceNumber}.pdf`;

//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader(
//       "Content-Disposition",
//       `inline; filename="${fileName}"`
//     );

//     doc.pipe(res);

//     createInvoiceContent(doc, order, items);

//     doc.end();

//   } catch (error) {
//     console.error("Get invoice PDF error:", error);

//     if (!res.headersSent) {
//       return res.status(500).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   }
// };

// // ========================================
// // Get Invoice JSON Data
// // ========================================
// exports.getInvoiceByOrder = async (req, res) => {
//   try {
//     const { orderId } = req.params;

//     const order = await Order.findById(orderId).populate(
//       "user",
//       "fullName phone email"
//     );

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found",
//       });
//     }

//     const items = await OrderItem.find({
//       order: order._id,
//     }).populate("product", "name price");

//     return res.status(200).json({
//       success: true,

//       invoice: {
//         invoiceNumber: order.invoiceNumber,
//         invoiceGenerated: order.invoiceGenerated,
//         invoiceGeneratedAt: order.invoiceGeneratedAt,

//         orderNumber: order.orderNumber,
//         orderDate: order.placedAt || order.createdAt,

//         customer: order.user,

//         shippingAddress: order.shippingAddress,

//         items,

//         subtotal: order.subtotal,
//         discount: order.discount,
//         deliveryFee: order.deliveryFee,
//         tax: order.tax,
//         totalAmount: order.totalAmount,

//         paymentMethod: order.paymentMethod,
//         paymentStatus: order.paymentStatus,

//         orderStatus: order.orderStatus,
//       },
//     });

//   } catch (error) {
//     console.error("Get invoice data error:", error);

//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ========================================
// // Download Single Invoice PDF
// // ========================================
// exports.downloadInvoice = async (req, res) => {
//   try {
//     const { orderId } = req.params;

//     const order = await Order.findById(orderId).populate(
//       "user",
//       "fullName phone email"
//     );

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found",
//       });
//     }

//     if (!order.invoiceGenerated || !order.invoiceNumber) {
//       return res.status(400).json({
//         success: false,
//         message: "Invoice has not been generated",
//       });
//     }

//     const items = await OrderItem.find({
//       order: order._id,
//     }).populate("product", "name price");

//     const doc = new PDFDocument({
//       size: "A4",
//       margin: 50,
//     });

//     const fileName = `${order.invoiceNumber}.pdf`;

//     res.setHeader("Content-Type", "application/pdf");

//     res.setHeader(
//       "Content-Disposition",
//       `attachment; filename="${fileName}"`
//     );

//     doc.pipe(res);

//     createInvoiceContent(doc, order, items);

//     doc.end();

//   } catch (error) {
//     console.error("Download invoice error:", error);

//     if (!res.headersSent) {
//       return res.status(500).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   }
// };

// // ========================================
// // Get All Invoices
// // ========================================
// exports.getAllInvoices = async (req, res) => {
//   try {
//     const { search } = req.query;

//     let invoices = await Order.find({
//       invoiceGenerated: true,
//     })
//       .populate("user", "fullName phone email")
//       .sort({
//         invoiceGeneratedAt: -1,
//       });

//     // Search
//     if (search && search.trim()) {
//       const term = search.trim().toLowerCase();

//       invoices = invoices.filter((invoice) => {
//         const customerName =
//           invoice.user?.fullName ||
//           invoice.shippingAddress?.fullName ||
//           "";

//         const phone = invoice.user?.phone || "";
//         const email = invoice.user?.email || "";

//         return (
//           customerName.toLowerCase().includes(term) ||
//           (invoice.invoiceNumber || "")
//             .toLowerCase()
//             .includes(term) ||
//           (invoice.orderNumber || "")
//             .toLowerCase()
//             .includes(term) ||
//           phone.toLowerCase().includes(term) ||
//           email.toLowerCase().includes(term)
//         );
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       count: invoices.length,
//       invoices,
//     });

//   } catch (error) {
//     console.error("Get all invoices error:", error);

//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ========================================
// // Generate All / Filtered Invoices
// // ========================================
// exports.generateAllInvoices = async (req, res) => {
//   try {
//     const {
//       customerId,
//       orderStatus,
//       search,
//       dateFrom,
//       dateTo,
//       onlyPending,
//     } = {
//       ...req.query,
//       ...req.body,
//     };

//     const filter = {};

//     // By default only orders without invoices
//     if (onlyPending !== "false") {
//       filter.$or = [
//         {
//           invoiceGenerated: {
//             $ne: true,
//           },
//         },
//         {
//           invoiceGenerated: {
//             $exists: false,
//           },
//         },
//       ];
//     }

//     // Customer
//     if (customerId && customerId !== "all") {
//       filter.user = customerId;
//     }

//     // Order status
//     if (orderStatus && orderStatus !== "all") {
//       filter.orderStatus = orderStatus;
//     }

//     // Date filter
//     if (dateFrom || dateTo) {
//       filter.placedAt = {};

//       if (dateFrom) {
//         filter.placedAt.$gte = new Date(dateFrom);
//       }

//       if (dateTo) {
//         filter.placedAt.$lte = new Date(dateTo);
//       }
//     }

//     let orders = await Order.find(filter).populate(
//       "user",
//       "fullName phone email"
//     );

//     // Search populated customer
//     if (search && search.trim()) {
//       const term = search.trim().toLowerCase();

//       orders = orders.filter((order) => {
//         const customerName =
//           order.user?.fullName ||
//           order.shippingAddress?.fullName ||
//           "";

//         return (
//           (order.orderNumber || "")
//             .toLowerCase()
//             .includes(term) ||
//           customerName.toLowerCase().includes(term)
//         );
//       });
//     }

//     if (!orders.length) {
//       return res.status(200).json({
//         success: true,
//         message:
//           "No matching orders found for the selected filters.",
//         generatedCount: 0,
//         invoices: [],
//       });
//     }

//     const generated = [];

//     for (let i = 0; i < orders.length; i++) {
//       const order = orders[i];

//       // Do not generate duplicate invoice
//       if (
//         order.invoiceGenerated &&
//         order.invoiceNumber &&
//         onlyPending !== "false"
//       ) {
//         continue;
//       }

//       const invoiceNumber =
//         "INV-" +
//         new Date().getFullYear() +
//         "-" +
//         Date.now() +
//         "-" +
//         i;

//       order.invoiceGenerated = true;
//       order.invoiceNumber = invoiceNumber;
//       order.invoiceGeneratedAt = new Date();

//       await order.save();

//       generated.push({
//         orderId: order._id,
//         orderNumber: order.orderNumber,
//         customer:
//           order.user?.fullName ||
//           order.shippingAddress?.fullName ||
//           "N/A",
//         invoiceNumber,
//         invoiceGeneratedAt: order.invoiceGeneratedAt,
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: `Generated ${generated.length} invoice(s) successfully`,
//       generatedCount: generated.length,
//       invoices: generated,
//     });

//   } catch (error) {
//     console.error("Generate all invoices error:", error);

//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ========================================
// // Download Filtered Invoices as ONE PDF
// // ========================================
// exports.downloadFilteredInvoices = async (req, res) => {
//   try {
//     /*
//     Supported filters:
    
//     Body:
//       {
//         invoiceIds: [],
//         customerId: "",
//         orderStatus: "",
//         status: "",
//         search: "",
//         dateFrom: "",
//         dateTo: ""
//       }
    
//     Query parameters are also supported.
//     */

//     const {
//       invoiceIds,
//       customerId,
//       orderStatus,
//       status,
//       search,
//       dateFrom,
//       dateTo,
//     } = {
//       ...req.query,
//       ...req.body,
//     };

//     const filter = {
//       invoiceGenerated: true,
//     };

//     // ========================================
//     // Invoice IDs
//     // ========================================
//     let selectedInvoiceIds = invoiceIds;

//     if (typeof selectedInvoiceIds === "string") {
//       try {
//         selectedInvoiceIds = JSON.parse(selectedInvoiceIds);
//       } catch (error) {
//         selectedInvoiceIds = selectedInvoiceIds
//           .split(",")
//           .map((id) => id.trim())
//           .filter(Boolean);
//       }
//     }

//     if (
//       Array.isArray(selectedInvoiceIds) &&
//       selectedInvoiceIds.length > 0
//     ) {
//       filter._id = {
//         $in: selectedInvoiceIds,
//       };
//     }

//     // ========================================
//     // Customer filter
//     // ========================================
//     if (customerId && customerId !== "all") {
//       filter.user = customerId;
//     }

//     // ========================================
//     // Status filter
//     // ========================================
//     const selectedStatus = orderStatus || status;

//     if (
//       selectedStatus &&
//       selectedStatus !== "all"
//     ) {
//       filter.orderStatus = selectedStatus;
//     }

//     // ========================================
//     // Date filter
//     // ========================================
//     if (dateFrom || dateTo) {
//       filter.placedAt = {};

//       if (dateFrom) {
//         filter.placedAt.$gte = new Date(dateFrom);
//       }

//       if (dateTo) {
//         filter.placedAt.$lte = new Date(dateTo);
//       }
//     }

//     // ========================================
//     // Find invoices
//     // ========================================
//     let invoices = await Order.find(filter)
//       .populate("user", "fullName phone email")
//       .sort({
//         invoiceGeneratedAt: -1,
//       });

//     // ========================================
//     // Search
//     // ========================================
//     if (search && search.trim()) {
//       const term = search.trim().toLowerCase();

//       invoices = invoices.filter((invoice) => {
//         const customerName =
//           invoice.user?.fullName ||
//           invoice.shippingAddress?.fullName ||
//           "";

//         const phone = invoice.user?.phone || "";
//         const email = invoice.user?.email || "";

//         return (
//           customerName.toLowerCase().includes(term) ||
//           (invoice.invoiceNumber || "")
//             .toLowerCase()
//             .includes(term) ||
//           (invoice.orderNumber || "")
//             .toLowerCase()
//             .includes(term) ||
//           phone.toLowerCase().includes(term) ||
//           email.toLowerCase().includes(term)
//         );
//       });
//     }

//     // ========================================
//     // No invoices
//     // ========================================
//     if (!invoices.length) {
//       return res.status(404).json({
//         success: false,
//         message:
//           "No generated invoices found for the selected filters.",
//       });
//     }

//     console.log(
//       `Generating combined PDF for ${invoices.length} invoice(s)`
//     );

//     // ========================================
//     // Get items for each invoice
//     // ========================================
//     const invoicesWithItems = await Promise.all(
//       invoices.map(async (order) => {
//         const items = await OrderItem.find({
//           order: order._id,
//         }).populate("product", "name price");

//         return {
//           order,
//           items,
//         };
//       })
//     );

//     // ========================================
//     // Create ONE PDF
//     // ========================================
//     const doc = new PDFDocument({
//       size: "A4",
//       margin: 50,
//       autoFirstPage: true,
//     });

//     const fileName = `RudraGroceries-Invoices-${new Date()
//       .toISOString()
//       .slice(0, 10)}.pdf`;

//     res.setHeader(
//       "Content-Type",
//       "application/pdf"
//     );

//     res.setHeader(
//       "Content-Disposition",
//       `attachment; filename="${fileName}"`
//     );

//     // Pipe PDF to response
//     doc.pipe(res);

//     // ========================================
//     // Add each invoice on separate page
//     // ========================================
//     invoicesWithItems.forEach(
//       ({ order, items }, index) => {
//         if (index > 0) {
//           doc.addPage();
//         }

//         createInvoiceContent(
//           doc,
//           order,
//           items
//         );
//       }
//     );

//     // Finish PDF
//     doc.end();

//   } catch (error) {
//     console.error(
//       "Download filtered invoices error:",
//       error
//     );

//     if (!res.headersSent) {
//       return res.status(500).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   }
// };

// // ========================================
// // Download ALL / FILTERED Invoices as ONE PDF
// // ========================================
// exports.downloadAllInvoices = async (req, res) => {
//   try {
//     const {
//       invoiceIds,
//       customerId,
//       orderStatus,
//       status,
//       search,
//       dateFrom,
//       dateTo,
//     } = {
//       ...req.query,
//       ...req.body,
//     };

//     const filter = {
//       invoiceGenerated: true,
//     };

//     // ========================================
//     // Invoice IDs
//     // ========================================
//     let selectedInvoiceIds = invoiceIds;

//     if (typeof selectedInvoiceIds === "string") {
//       try {
//         selectedInvoiceIds = JSON.parse(selectedInvoiceIds);
//       } catch (error) {
//         selectedInvoiceIds = selectedInvoiceIds
//           .split(",")
//           .map((id) => id.trim())
//           .filter(Boolean);
//       }
//     }

//     if (
//       Array.isArray(selectedInvoiceIds) &&
//       selectedInvoiceIds.length > 0
//     ) {
//       filter._id = {
//         $in: selectedInvoiceIds,
//       };
//     }

//     // ========================================
//     // Customer filter
//     // ========================================
//     if (customerId && customerId !== "all") {
//       filter.user = customerId;
//     }

//     // ========================================
//     // Status filter
//     // ========================================
//     const selectedStatus = orderStatus || status;

//     if (
//       selectedStatus &&
//       selectedStatus !== "all"
//     ) {
//       filter.orderStatus = selectedStatus;
//     }

//     // ========================================
//     // Date filter
//     // ========================================
//     if (dateFrom || dateTo) {
//       filter.placedAt = {};

//       if (dateFrom) {
//         filter.placedAt.$gte = new Date(dateFrom);
//       }

//       if (dateTo) {
//         filter.placedAt.$lte = new Date(dateTo);
//       }
//     }

//     // ========================================
//     // Find invoices
//     // ========================================
//     let invoices = await Order.find(filter)
//       .populate("user", "fullName phone email")
//       .sort({
//         invoiceGeneratedAt: -1,
//       });

//     // ========================================
//     // Search
//     // ========================================
//     if (search && search.trim()) {
//       const term = search.trim().toLowerCase();

//       invoices = invoices.filter((invoice) => {
//         const customerName =
//           invoice.user?.fullName ||
//           invoice.shippingAddress?.fullName ||
//           "";

//         const phone = invoice.user?.phone || "";
//         const email = invoice.user?.email || "";

//         return (
//           customerName.toLowerCase().includes(term) ||
//           (invoice.invoiceNumber || "")
//             .toLowerCase()
//             .includes(term) ||
//           (invoice.orderNumber || "")
//             .toLowerCase()
//             .includes(term) ||
//           phone.toLowerCase().includes(term) ||
//           email.toLowerCase().includes(term)
//         );
//       });
//     }

//     // ========================================
//     // No invoices
//     // ========================================
//     if (!invoices.length) {
//       return res.status(404).json({
//         success: false,
//         message:
//           "No generated invoices found for the selected filters.",
//       });
//     }

//     console.log(
//       `Generating combined PDF for ${invoices.length} invoice(s)`
//     );

//     // ========================================
//     // Get items
//     // ========================================
//     const invoicesWithItems = await Promise.all(
//       invoices.map(async (order) => {
//         const items = await OrderItem.find({
//           order: order._id,
//         }).populate("product", "name price");

//         return {
//           order,
//           items,
//         };
//       })
//     );

//     // ========================================
//     // Create ONE PDF
//     // ========================================
//     const doc = new PDFDocument({
//       size: "A4",
//       margin: 50,
//       autoFirstPage: true,
//     });

//     const fileName = `RudraGroceries-Invoices-${new Date()
//       .toISOString()
//       .slice(0, 10)}.pdf`;

//     res.setHeader(
//       "Content-Type",
//       "application/pdf"
//     );

//     res.setHeader(
//       "Content-Disposition",
//       `attachment; filename="${fileName}"`
//     );

//     // Pipe PDF to response
//     doc.pipe(res);

//     // ========================================
//     // Add each invoice on separate page
//     // ========================================
//     invoicesWithItems.forEach(
//       ({ order, items }, index) => {
//         if (index > 0) {
//           doc.addPage();
//         }

//         createInvoiceContent(
//           doc,
//           order,
//           items
//         );
//       }
//     );

//     // Finish PDF
//     doc.end();

//   } catch (error) {
//     console.error(
//       "Download filtered invoices error:",
//       error
//     );

//     if (!res.headersSent) {
//       return res.status(500).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   }
// };

// // ========================================
// // Helper: Create Invoice PDF Content
// // ========================================
// function createInvoiceContent(doc, order, items) {
//   // ========================================
//   // Header
//   // ========================================
//   doc
//     .fontSize(24)
//     .font("Helvetica-Bold")
//     .text("RudraGroceries");

//   doc
//     .fontSize(10)
//     .font("Helvetica")
//     .text("Grocery E-Commerce Store");

//   doc.moveDown(1);

//   doc
//     .fontSize(20)
//     .font("Helvetica-Bold")
//     .text("INVOICE", {
//       align: "right",
//     });

//   doc.moveDown(0.5);

//   // ========================================
//   // Invoice Information
//   // ========================================
//   doc
//     .fontSize(10)
//     .font("Helvetica")
//     .text(
//       `Invoice Number: ${order.invoiceNumber}`,
//       {
//         align: "right",
//       }
//     );

//   doc.text(
//     `Invoice Date: ${formatDate(
//       order.invoiceGeneratedAt
//     )}`,
//     {
//       align: "right",
//     }
//   );

//   doc.text(
//     `Order Number: ${order.orderNumber || "-"}`,
//     {
//       align: "right",
//     }
//   );

//   doc.text(
//     `Order Date: ${formatDate(
//       order.placedAt || order.createdAt
//     )}`,
//     {
//       align: "right",
//     }
//   );

//   doc.moveDown(2);

//   // ========================================
//   // Customer
//   // ========================================
//   const customer = order.user || {};
//   const address = order.shippingAddress || {};

//   doc
//     .fontSize(12)
//     .font("Helvetica-Bold")
//     .text("Bill To:");

//   doc
//     .fontSize(10)
//     .font("Helvetica")
//     .text(
//       customer.fullName ||
//       address.fullName ||
//       "-"
//     );

//   doc.text(
//     `Phone: ${
//       customer.phone ||
//       address.phone ||
//       "-"
//     }`
//   );

//   if (customer.email) {
//     doc.text(
//       `Email: ${customer.email}`
//     );
//   }

//   doc.moveDown(1);

//   // ========================================
//   // Shipping Address
//   // ========================================
//   doc
//     .fontSize(12)
//     .font("Helvetica-Bold")
//     .text("Shipping Address:");

//   doc
//     .fontSize(10)
//     .font("Helvetica")
//     .text(
//       address.address || "-"
//     );

//   const cityState = [
//     address.city,
//     address.state,
//   ]
//     .filter(Boolean)
//     .join(", ");

//   if (cityState || address.pincode) {
//     doc.text(
//       `${cityState}${
//         address.pincode
//           ? ` - ${address.pincode}`
//           : ""
//       }`
//     );
//   }

//   doc.moveDown(2);

//   // ========================================
//   // Order Items
//   // ========================================
//   doc
//     .fontSize(12)
//     .font("Helvetica-Bold")
//     .text("Order Items");

//   doc.moveDown(0.5);

//   const tableTop = doc.y;

//   // Table Header
//   doc
//     .fontSize(10)
//     .font("Helvetica-Bold")
//     .text(
//       "Product",
//       50,
//       tableTop,
//       {
//         width: 230,
//       }
//     );

//   doc.text(
//     "Qty",
//     290,
//     tableTop,
//     {
//       width: 50,
//       align: "center",
//     }
//   );

//   doc.text(
//     "Price",
//     350,
//     tableTop,
//     {
//       width: 80,
//       align: "right",
//     }
//   );

//   doc.text(
//     "Amount",
//     440,
//     tableTop,
//     {
//       width: 100,
//       align: "right",
//     }
//   );

//   doc
//     .moveTo(50, tableTop + 18)
//     .lineTo(550, tableTop + 18)
//     .stroke();

//   let y = tableTop + 28;

//   // ========================================
//   // Items
//   // ========================================
//   items.forEach((item) => {
//     const productName =
//       item.product?.name ||
//       item.name ||
//       "Product";

//     const quantity =
//       item.quantity ||
//       item.qty ||
//       1;

//     const price =
//       item.price ??
//       item.unitPrice ??
//       item.product?.price ??
//       0;

//     const amount =
//       item.total ??
//       item.totalPrice ??
//       price * quantity;

//     // Product
//     doc
//       .fontSize(10)
//       .font("Helvetica")
//       .text(
//         productName,
//         50,
//         y,
//         {
//           width: 230,
//         }
//       );

//     // Quantity
//     doc.text(
//       String(quantity),
//       290,
//       y,
//       {
//         width: 50,
//         align: "center",
//       }
//     );

//     // Price
//     doc.text(
//       `Rs. ${Number(price).toFixed(2)}`,
//       350,
//       y,
//       {
//         width: 80,
//         align: "right",
//       }
//     );

//     // Amount
//     doc.text(
//       `Rs. ${Number(amount).toFixed(2)}`,
//       440,
//       y,
//       {
//         width: 100,
//         align: "right",
//       }
//     );

//     y += 25;

//     // Add page if many products
//     if (y > 680) {
//       doc.addPage();
//       y = 60;
//     }
//   });

//   doc
//     .moveTo(50, y)
//     .lineTo(550, y)
//     .stroke();

//   y += 20;

//   // ========================================
//   // Totals
//   // ========================================
//   const subtotal = Number(
//     order.subtotal || 0
//   );

//   const discount = Number(
//     order.discount || 0
//   );

//   const deliveryFee = Number(
//     order.deliveryFee || 0
//   );

//   const tax = Number(
//     order.tax || 0
//   );

//   const totalAmount = Number(
//     order.totalAmount || 0
//   );

//   // Subtotal
//   doc
//     .fontSize(10)
//     .font("Helvetica")
//     .text(
//       "Subtotal:",
//       350,
//       y,
//       {
//         width: 100,
//         align: "right",
//       }
//     );

//   doc.text(
//     `Rs. ${subtotal.toFixed(2)}`,
//     450,
//     y,
//     {
//       width: 100,
//       align: "right",
//     }
//   );

//   y += 20;

//   // Discount
//   doc.text(
//     "Discount:",
//     350,
//     y,
//     {
//       width: 100,
//       align: "right",
//     }
//   );

//   doc.text(
//     `Rs. ${discount.toFixed(2)}`,
//     450,
//     y,
//     {
//       width: 100,
//       align: "right",
//     }
//   );

//   y += 20;

//   // Delivery
//   doc.text(
//     "Delivery Fee:",
//     350,
//     y,
//     {
//       width: 100,
//       align: "right",
//     }
//   );

//   doc.text(
//     `Rs. ${deliveryFee.toFixed(2)}`,
//     450,
//     y,
//     {
//       width: 100,
//       align: "right",
//     }
//   );

//   y += 20;

//   // Tax
//   doc.text(
//     "Tax:",
//     350,
//     y,
//     {
//       width: 100,
//       align: "right",
//     }
//   );

//   doc.text(
//     `Rs. ${tax.toFixed(2)}`,
//     450,
//     y,
//     {
//       width: 100,
//       align: "right",
//     }
//   );

//   y += 25;

//   // Total
//   doc
//     .fontSize(13)
//     .font("Helvetica-Bold")
//     .text(
//       "Total Amount:",
//       330,
//       y,
//       {
//         width: 120,
//         align: "right",
//       }
//     );

//   doc.text(
//     `Rs. ${totalAmount.toFixed(2)}`,
//     450,
//     y,
//     {
//       width: 100,
//       align: "right",
//     }
//   );

//   y += 40;

//   // ========================================
//   // Payment Details
//   // ========================================
//   doc
//     .fontSize(12)
//     .font("Helvetica-Bold")
//     .text(
//       "Payment Details",
//       50,
//       y
//     );

//   y += 20;

//   doc
//     .fontSize(10)
//     .font("Helvetica")
//     .text(
//       `Payment Method: ${formatPaymentMethod(
//         order.paymentMethod
//       )}`,
//       50,
//       y
//     );

//   y += 18;

//   doc.text(
//     `Payment Status: ${formatPaymentStatus(
//       order.paymentStatus
//     )}`,
//     50,
//     y
//   );

//   y += 18;

//   doc.text(
//     `Order Status: ${formatOrderStatus(
//       order.orderStatus
//     )}`,
//     50,
//     y
//   );

//   // ========================================
//   // Footer
//   // ========================================
//   doc
//     .fontSize(9)
//     .font("Helvetica")
//     .text(
//       "Thank you for shopping with RudraGroceries!",
//       50,
//       750,
//       {
//         align: "center",
//         width: 500,
//       }
//     );

//   doc.text(
//     "This is a computer-generated invoice.",
//     50,
//     765,
//     {
//       align: "center",
//       width: 500,
//     }
//   );
// }

// // ========================================
// // Helper: Format Date
// // ========================================
// function formatDate(date) {
//   if (!date) {
//     return "-";
//   }

//   return new Date(date).toLocaleString(
//     "en-IN",
//     {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     }
//   );
// }

// // ========================================
// // Helper: Payment Method
// // ========================================
// function formatPaymentMethod(method) {
//   if (!method) {
//     return "-";
//   }

//   return String(method)
//     .replace(/_/g, " ")
//     .toUpperCase();
// }

// // ========================================
// // Helper: Payment Status
// // ========================================
// function formatPaymentStatus(status) {
//   if (!status) {
//     return "-";
//   }

//   return String(status)
//     .replace(/_/g, " ")
//     .replace(/\b\w/g, (char) =>
//       char.toUpperCase()
//     );
// }

// // ========================================
// // Helper: Order Status
// // ========================================
// function formatOrderStatus(status) {
//   if (!status) {
//     return "-";
//   }

//   return String(status)
//     .replace(/_/g, " ")
//     .replace(/\b\w/g, (char) =>
//       char.toUpperCase()
//     );
// }

const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const PDFDocument = require("pdfkit");

// ========================================
// Helper Functions (must be defined first)
// ========================================

function formatDate(date) {
  if (!date) return "-";
  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatPaymentMethod(method) {
  if (!method) return "-";
  return String(method).replace(/_/g, " ").toUpperCase();
}

function formatPaymentStatus(status) {
  if (!status) return "-";
  return String(status).replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatOrderStatus(status) {
  if (!status) return "-";
  return String(status).replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

// ========================================
// Helper: Create Invoice PDF Content
// ========================================
function createInvoiceContent(doc, order, items) {
  doc.fontSize(24).font("Helvetica-Bold").text("RudraGroceries");
  doc.fontSize(10).font("Helvetica").text("Grocery E-Commerce Store");
  doc.moveDown(1);
  doc.fontSize(20).font("Helvetica-Bold").text("INVOICE", { align: "right" });
  doc.moveDown(0.5);

  doc.fontSize(10).font("Helvetica").text(`Invoice Number: ${order.invoiceNumber}`, { align: "right" });
  doc.text(`Invoice Date: ${formatDate(order.invoiceGeneratedAt)}`, { align: "right" });
  doc.text(`Order Number: ${order.orderNumber || "-"}`, { align: "right" });
  doc.text(`Order Date: ${formatDate(order.placedAt || order.createdAt)}`, { align: "right" });
  doc.moveDown(2);

  const customer = order.user || {};
  const address = order.shippingAddress || {};

  doc.fontSize(12).font("Helvetica-Bold").text("Bill To:");
  doc.fontSize(10).font("Helvetica").text(customer.fullName || address.fullName || "-");
  doc.text(`Phone: ${customer.phone || address.phone || "-"}`);
  if (customer.email) doc.text(`Email: ${customer.email}`);
  doc.moveDown(1);

  doc.fontSize(12).font("Helvetica-Bold").text("Shipping Address:");
  doc.fontSize(10).font("Helvetica").text(address.address || "-");
  const cityState = [address.city, address.state].filter(Boolean).join(", ");
  if (cityState || address.pincode) {
    doc.text(`${cityState}${address.pincode ? ` - ${address.pincode}` : ""}`);
  }
  doc.moveDown(2);

  doc.fontSize(12).font("Helvetica-Bold").text("Order Items");
  doc.moveDown(0.5);

  const tableTop = doc.y;
  doc.fontSize(10).font("Helvetica-Bold").text("Product", 50, tableTop, { width: 230 });
  doc.text("Qty", 290, tableTop, { width: 50, align: "center" });
  doc.text("Price", 350, tableTop, { width: 80, align: "right" });
  doc.text("Amount", 440, tableTop, { width: 100, align: "right" });
  doc.moveTo(50, tableTop + 18).lineTo(550, tableTop + 18).stroke();

  let y = tableTop + 28;

  items.forEach((item) => {
    const productName = item.product?.name || item.name || "Product";
    const quantity = item.quantity || item.qty || 1;
    const price = item.price ?? item.unitPrice ?? item.product?.price ?? 0;
    const amount = item.total ?? item.totalPrice ?? price * quantity;

    doc.fontSize(10).font("Helvetica").text(productName, 50, y, { width: 230 });
    doc.text(String(quantity), 290, y, { width: 50, align: "center" });
    doc.text(`Rs. ${Number(price).toFixed(2)}`, 350, y, { width: 80, align: "right" });
    doc.text(`Rs. ${Number(amount).toFixed(2)}`, 440, y, { width: 100, align: "right" });
    y += 25;
    if (y > 680) { doc.addPage(); y = 60; }
  });

  doc.moveTo(50, y).lineTo(550, y).stroke();
  y += 20;

  const subtotal = Number(order.subtotal || 0);
  const discount = Number(order.discount || 0);
  const deliveryFee = Number(order.deliveryFee || 0);
  const tax = Number(order.tax || 0);
  const totalAmount = Number(order.totalAmount || 0);

  doc.fontSize(10).font("Helvetica").text("Subtotal:", 350, y, { width: 100, align: "right" });
  doc.text(`Rs. ${subtotal.toFixed(2)}`, 450, y, { width: 100, align: "right" });
  y += 20;

  doc.text("Discount:", 350, y, { width: 100, align: "right" });
  doc.text(`Rs. ${discount.toFixed(2)}`, 450, y, { width: 100, align: "right" });
  y += 20;

  doc.text("Delivery Fee:", 350, y, { width: 100, align: "right" });
  doc.text(`Rs. ${deliveryFee.toFixed(2)}`, 450, y, { width: 100, align: "right" });
  y += 20;

  doc.text("Tax:", 350, y, { width: 100, align: "right" });
  doc.text(`Rs. ${tax.toFixed(2)}`, 450, y, { width: 100, align: "right" });
  y += 25;

  doc.fontSize(13).font("Helvetica-Bold").text("Total Amount:", 330, y, { width: 120, align: "right" });
  doc.text(`Rs. ${totalAmount.toFixed(2)}`, 450, y, { width: 100, align: "right" });
  y += 40;

  doc.fontSize(12).font("Helvetica-Bold").text("Payment Details", 50, y);
  y += 20;

  doc.fontSize(10).font("Helvetica").text(`Payment Method: ${formatPaymentMethod(order.paymentMethod)}`, 50, y);
  y += 18;
  doc.text(`Payment Status: ${formatPaymentStatus(order.paymentStatus)}`, 50, y);
  y += 18;
  doc.text(`Order Status: ${formatOrderStatus(order.orderStatus)}`, 50, y);

  doc.fontSize(9).font("Helvetica").text("Thank you for shopping with RudraGroceries!", 50, 750, { align: "center", width: 500 });
  doc.text("This is a computer-generated invoice.", 50, 765, { align: "center", width: 500 });
}

// ========================================
// Generate Invoice
// ========================================
const generateInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate(
      "user",
      "fullName phone email"
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const items = await OrderItem.find({
      order: order._id,
    }).populate("product", "name price");

    if (order.invoiceGenerated && order.invoiceNumber) {
      return res.status(200).json({
        success: true,
        message: "Invoice already generated",
        invoiceNumber: order.invoiceNumber,
        invoiceGeneratedAt: order.invoiceGeneratedAt,
        order,
        items,
      });
    }

    const invoiceNumber = "INV-" + new Date().getFullYear() + "-" + Date.now();

    order.invoiceGenerated = true;
    order.invoiceNumber = invoiceNumber;
    order.invoiceGeneratedAt = new Date();

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Invoice generated successfully",
      invoiceNumber,
      invoiceGeneratedAt: order.invoiceGeneratedAt,
      order,
      items,
    });
  } catch (error) {
    console.error("Generate invoice error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// Preview Invoice PDF
// ========================================
const getInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate(
      "user",
      "fullName phone email"
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const items = await OrderItem.find({
      order: order._id,
    }).populate("product", "name price");

    if (!order.invoiceGenerated || !order.invoiceNumber) {
      return res.status(400).json({
        success: false,
        message: "Invoice has not been generated for this order",
      });
    }

    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const fileName = `${order.invoiceNumber}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${fileName}"`);

    doc.pipe(res);
    createInvoiceContent(doc, order, items);
    doc.end();
  } catch (error) {
    console.error("Get invoice PDF error:", error);
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
};

// ========================================
// Get Invoice JSON Data
// ========================================
const getInvoiceByOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate(
      "user",
      "fullName phone email"
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const items = await OrderItem.find({
      order: order._id,
    }).populate("product", "name price");

    return res.status(200).json({
      success: true,
      invoice: {
        invoiceNumber: order.invoiceNumber,
        invoiceGenerated: order.invoiceGenerated,
        invoiceGeneratedAt: order.invoiceGeneratedAt,
        orderNumber: order.orderNumber,
        orderDate: order.placedAt || order.createdAt,
        customer: order.user,
        shippingAddress: order.shippingAddress,
        items,
        subtotal: order.subtotal,
        discount: order.discount,
        deliveryFee: order.deliveryFee,
        tax: order.tax,
        totalAmount: order.totalAmount,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
      },
    });
  } catch (error) {
    console.error("Get invoice data error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// Download Single Invoice PDF
// ========================================
const downloadInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate(
      "user",
      "fullName phone email"
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (!order.invoiceGenerated || !order.invoiceNumber) {
      return res.status(400).json({
        success: false,
        message: "Invoice has not been generated",
      });
    }

    const items = await OrderItem.find({
      order: order._id,
    }).populate("product", "name price");

    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const fileName = `${order.invoiceNumber}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    doc.pipe(res);
    createInvoiceContent(doc, order, items);
    doc.end();
  } catch (error) {
    console.error("Download invoice error:", error);
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
};

// ========================================
// Get All Invoices
// ========================================
const getAllInvoices = async (req, res) => {
  try {
    const { search } = req.query;

    let invoices = await Order.find({ invoiceGenerated: true })
      .populate("user", "fullName phone email")
      .sort({ invoiceGeneratedAt: -1 });

    if (search && search.trim()) {
      const term = search.trim().toLowerCase();
      invoices = invoices.filter((invoice) => {
        const customerName =
          invoice.user?.fullName || invoice.shippingAddress?.fullName || "";
        const phone = invoice.user?.phone || "";
        const email = invoice.user?.email || "";

        return (
          customerName.toLowerCase().includes(term) ||
          (invoice.invoiceNumber || "").toLowerCase().includes(term) ||
          (invoice.orderNumber || "").toLowerCase().includes(term) ||
          phone.toLowerCase().includes(term) ||
          email.toLowerCase().includes(term)
        );
      });
    }

    return res.status(200).json({
      success: true,
      count: invoices.length,
      invoices,
    });
  } catch (error) {
    console.error("Get all invoices error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// Generate All / Filtered Invoices
// ========================================
const generateAllInvoices = async (req, res) => {
  try {
    const { customerId, orderStatus, search, dateFrom, dateTo, onlyPending } = {
      ...req.query,
      ...req.body,
    };

    const filter = {};

    if (onlyPending !== "false") {
      filter.$or = [
        { invoiceGenerated: { $ne: true } },
        { invoiceGenerated: { $exists: false } },
      ];
    }

    if (customerId && customerId !== "all") {
      filter.user = customerId;
    }

    if (orderStatus && orderStatus !== "all") {
      filter.orderStatus = orderStatus;
    }

    if (dateFrom || dateTo) {
      filter.placedAt = {};
      if (dateFrom) filter.placedAt.$gte = new Date(dateFrom);
      if (dateTo) filter.placedAt.$lte = new Date(dateTo);
    }

    let orders = await Order.find(filter).populate("user", "fullName phone email");

    if (search && search.trim()) {
      const term = search.trim().toLowerCase();
      orders = orders.filter((order) => {
        const customerName =
          order.user?.fullName || order.shippingAddress?.fullName || "";
        return (
          (order.orderNumber || "").toLowerCase().includes(term) ||
          customerName.toLowerCase().includes(term)
        );
      });
    }

    if (!orders.length) {
      return res.status(200).json({
        success: true,
        message: "No matching orders found for the selected filters.",
        generatedCount: 0,
        invoices: [],
      });
    }

    const generated = [];

    for (let i = 0; i < orders.length; i++) {
      const order = orders[i];

      if (order.invoiceGenerated && order.invoiceNumber && onlyPending !== "false") {
        continue;
      }

      const invoiceNumber = "INV-" + new Date().getFullYear() + "-" + Date.now() + "-" + i;

      order.invoiceGenerated = true;
      order.invoiceNumber = invoiceNumber;
      order.invoiceGeneratedAt = new Date();

      await order.save();

      generated.push({
        orderId: order._id,
        orderNumber: order.orderNumber,
        customer: order.user?.fullName || order.shippingAddress?.fullName || "N/A",
        invoiceNumber,
        invoiceGeneratedAt: order.invoiceGeneratedAt,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Generated ${generated.length} invoice(s) successfully`,
      generatedCount: generated.length,
      invoices: generated,
    });
  } catch (error) {
    console.error("Generate all invoices error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// Download Filtered Invoices as ONE PDF
// ========================================
const downloadFilteredInvoices = async (req, res) => {
  try {
    const { invoiceIds, customerId, orderStatus, status, search, dateFrom, dateTo } = {
      ...req.query,
      ...req.body,
    };

    const filter = { invoiceGenerated: true };

    // Parse invoice IDs
    let selectedInvoiceIds = invoiceIds;
    if (typeof selectedInvoiceIds === "string") {
      try {
        selectedInvoiceIds = JSON.parse(selectedInvoiceIds);
      } catch (error) {
        selectedInvoiceIds = selectedInvoiceIds.split(",").map((id) => id.trim()).filter(Boolean);
      }
    }

    if (Array.isArray(selectedInvoiceIds) && selectedInvoiceIds.length > 0) {
      filter._id = { $in: selectedInvoiceIds };
    }

    if (customerId && customerId !== "all") {
      filter.user = customerId;
    }

    const selectedStatus = orderStatus || status;
    if (selectedStatus && selectedStatus !== "all") {
      filter.orderStatus = selectedStatus;
    }

    if (dateFrom || dateTo) {
      filter.placedAt = {};
      if (dateFrom) filter.placedAt.$gte = new Date(dateFrom);
      if (dateTo) filter.placedAt.$lte = new Date(dateTo);
    }

    let invoices = await Order.find(filter)
      .populate("user", "fullName phone email")
      .sort({ invoiceGeneratedAt: -1 });

    if (search && search.trim()) {
      const term = search.trim().toLowerCase();
      invoices = invoices.filter((invoice) => {
        const customerName =
          invoice.user?.fullName || invoice.shippingAddress?.fullName || "";
        const phone = invoice.user?.phone || "";
        const email = invoice.user?.email || "";

        return (
          customerName.toLowerCase().includes(term) ||
          (invoice.invoiceNumber || "").toLowerCase().includes(term) ||
          (invoice.orderNumber || "").toLowerCase().includes(term) ||
          phone.toLowerCase().includes(term) ||
          email.toLowerCase().includes(term)
        );
      });
    }

    if (!invoices.length) {
      return res.status(404).json({
        success: false,
        message: "No generated invoices found for the selected filters.",
      });
    }

    console.log(`Generating combined PDF for ${invoices.length} invoice(s)`);

    const invoicesWithItems = await Promise.all(
      invoices.map(async (order) => {
        const items = await OrderItem.find({ order: order._id }).populate("product", "name price");
        return { order, items };
      })
    );

    const doc = new PDFDocument({ size: "A4", margin: 50, autoFirstPage: true });
    const fileName = `RudraGroceries-Invoices-${new Date().toISOString().slice(0, 10)}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    doc.pipe(res);

    invoicesWithItems.forEach(({ order, items }, index) => {
      if (index > 0) doc.addPage();
      createInvoiceContent(doc, order, items);
    });

    doc.end();
  } catch (error) {
    console.error("Download filtered invoices error:", error);
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
};

// ========================================
// Download ALL Invoices (no filters applied)
// ========================================
const downloadAllInvoices = async (req, res) => {
  try {
    // Get ALL invoices without any filters
    const invoices = await Order.find({ invoiceGenerated: true })
      .populate("user", "fullName phone email")
      .sort({ invoiceGeneratedAt: -1 });

    if (!invoices.length) {
      return res.status(404).json({
        success: false,
        message: "No invoices found",
      });
    }

    console.log(`Generating combined PDF for ${invoices.length} invoice(s)`);

    // Get items for each invoice
    const invoicesWithItems = await Promise.all(
      invoices.map(async (order) => {
        const items = await OrderItem.find({ order: order._id }).populate("product", "name price");
        return { order, items };
      })
    );

    // Create ONE PDF
    const doc = new PDFDocument({ size: "A4", margin: 50, autoFirstPage: true });
    const fileName = `RudraGroceries-All-Invoices-${new Date().toISOString().slice(0, 10)}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    doc.pipe(res);

    invoicesWithItems.forEach(({ order, items }, index) => {
      if (index > 0) doc.addPage();
      createInvoiceContent(doc, order, items);
    });

    doc.end();
  } catch (error) {
    console.error("Download all invoices error:", error);
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
};

// ========================================
// EXPORT ALL FUNCTIONS
// ========================================
module.exports = {
  generateInvoice,
  getInvoice,
  downloadInvoice,
  downloadAllInvoices,
  downloadFilteredInvoices,
  getInvoiceByOrder,
  getAllInvoices,
  generateAllInvoices,
};