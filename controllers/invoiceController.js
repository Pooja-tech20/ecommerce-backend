// const Order = require("../models/Order");
// const OrderItem = require("../models/OrderItem");

// // ========================================
// // Generate Invoice
// // ========================================
// exports.generateInvoice = async (req, res) => {
//   try {
//     const { orderId } = req.params;

//     const order = await Order.findById(orderId)
//       .populate("user", "fullName phone email");

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found",
//       });
//     }

//     // Invoice already generated
//     if (order.invoiceGenerated && order.invoiceNumber) {
//       return res.status(200).json({
//         success: true,
//         message: "Invoice already generated",
//         invoiceNumber: order.invoiceNumber,
//         invoiceGeneratedAt: order.invoiceGeneratedAt,
//         order,
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

//     res.status(200).json({
//       success: true,
//       message: "Invoice generated successfully",
//       invoiceNumber,
//       invoiceGeneratedAt: order.invoiceGeneratedAt,
//       order,
//     });

//   } catch (error) {
//     console.error("Generate invoice error:", error);

//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };


// // ========================================
// // Get Invoice
// // ========================================
// exports.getInvoice = async (req, res) => {
//   try {
//     const { orderId } = req.params;

//     const order = await Order.findById(orderId)
//       .populate("user", "fullName phone email");

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found",
//       });
//     }

//     // Get products/order items
//     const items = await OrderItem.find({
//       order: order._id,
//     }).populate("product", "name");

//     res.status(200).json({
//       success: true,

//       invoice: {
//         invoiceNumber: order.invoiceNumber,
//         invoiceGenerated: order.invoiceGenerated,
//         invoiceGeneratedAt: order.invoiceGeneratedAt,

//         orderNumber: order.orderNumber,
//         orderDate: order.placedAt,

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
//     console.error("Get invoice error:", error);

//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const PDFDocument = require("pdfkit");

// ========================================
// Generate Invoice
// ========================================
exports.generateInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate("user", "fullName phone email");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Get order items
    const items = await OrderItem.find({
      order: order._id,
    }).populate("product", "name price");

    // Invoice already generated
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

    // Generate invoice number
    const invoiceNumber =
      "INV-" +
      new Date().getFullYear() +
      "-" +
      Date.now();

    order.invoiceGenerated = true;
    order.invoiceNumber = invoiceNumber;
    order.invoiceGeneratedAt = new Date();

    await order.save();

    res.status(200).json({
      success: true,
      message: "Invoice generated successfully",
      invoiceNumber,
      invoiceGeneratedAt: order.invoiceGeneratedAt,
      order,
      items,
    });

  } catch (error) {
    console.error("Generate invoice error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ========================================
// Get Invoice PDF
// ========================================
exports.getInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;

    console.log("📄 Creating invoice PDF for:", orderId);

    const order = await Order.findById(orderId)
      .populate("user", "fullName phone email");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Get order items
    const items = await OrderItem.find({
      order: order._id,
    }).populate("product", "name price");

    // Invoice must be generated first
    if (!order.invoiceGenerated || !order.invoiceNumber) {
      return res.status(400).json({
        success: false,
        message: "Invoice has not been generated for this order",
      });
    }

    // ========================================
    // Create PDF
    // ========================================

    const doc = new PDFDocument({
      size: "A4",
      margin: 50,
    });

    const fileName = `${order.invoiceNumber}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${fileName}"`
    );

    // Send PDF directly to browser
    doc.pipe(res);

    // ========================================
    // HEADER
    // ========================================

    doc
      .fontSize(24)
      .font("Helvetica-Bold")
      .text("RudraGroceries", {
        align: "left",
      });

    doc
      .fontSize(10)
      .font("Helvetica")
      .text("Grocery E-Commerce Store");

    doc.moveDown(1);

    doc
      .fontSize(20)
      .font("Helvetica-Bold")
      .text("INVOICE", {
        align: "right",
      });

    doc.moveDown(0.5);

    // ========================================
    // INVOICE INFORMATION
    // ========================================

    doc
      .fontSize(10)
      .font("Helvetica")
      .text(`Invoice Number: ${order.invoiceNumber}`, {
        align: "right",
      });

    doc.text(
      `Invoice Date: ${formatDate(order.invoiceGeneratedAt)}`,
      {
        align: "right",
      }
    );

    doc.text(`Order Number: ${order.orderNumber}`, {
      align: "right",
    });

    doc.text(
      `Order Date: ${formatDate(order.placedAt || order.createdAt)}`,
      {
        align: "right",
      }
    );

    doc.moveDown(2);

    // ========================================
    // CUSTOMER + SHIPPING ADDRESS
    // ========================================

    const customer = order.user || {};
    const address = order.shippingAddress || {};

    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("Bill To:");

    doc
      .fontSize(10)
      .font("Helvetica")
      .text(customer.fullName || address.fullName || "-");

    if (customer.phone || address.phone) {
      doc.text(`Phone: ${customer.phone || address.phone}`);
    }

    if (customer.email) {
      doc.text(`Email: ${customer.email}`);
    }

    doc.moveDown(1);

    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("Shipping Address:");

    doc
      .fontSize(10)
      .font("Helvetica")
      .text(address.address || "-");

    doc.text(
      `${address.city || ""}, ${address.state || ""} - ${
        address.pincode || ""
      }`
    );

    doc.moveDown(2);

    // ========================================
    // PRODUCTS TABLE
    // ========================================

    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("Order Items");

    doc.moveDown(0.5);

    // Table header
    const tableTop = doc.y;

    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("Product", 50, tableTop, {
        width: 230,
      });

    doc.text("Qty", 290, tableTop, {
      width: 50,
      align: "center",
    });

    doc.text("Price", 350, tableTop, {
      width: 80,
      align: "right",
    });

    doc.text("Amount", 440, tableTop, {
      width: 100,
      align: "right",
    });

    doc.moveTo(50, tableTop + 18)
      .lineTo(550, tableTop + 18)
      .stroke();

    let y = tableTop + 28;

    // ========================================
    // ITEMS
    // ========================================

    items.forEach((item) => {
      const productName =
        item.product?.name ||
        item.name ||
        "Product";

      const quantity =
        item.quantity ||
        item.qty ||
        1;

      const price =
        item.price ??
        item.unitPrice ??
        item.product?.price ??
        0;

      const amount =
        item.total ??
        item.totalPrice ??
        price * quantity;

      doc
        .fontSize(10)
        .font("Helvetica")
        .text(productName, 50, y, {
          width: 230,
        });

      doc.text(String(quantity), 290, y, {
        width: 50,
        align: "center",
      });

      doc.text(`₹${Number(price).toFixed(2)}`, 350, y, {
        width: 80,
        align: "right",
      });

      doc.text(`₹${Number(amount).toFixed(2)}`, 440, y, {
        width: 100,
        align: "right",
      });

      y += 25;
    });

    doc.moveTo(50, y)
      .lineTo(550, y)
      .stroke();

    y += 20;

    // ========================================
    // TOTALS
    // ========================================

    const subtotal = Number(order.subtotal || 0);
    const discount = Number(order.discount || 0);
    const deliveryFee = Number(order.deliveryFee || 0);
    const tax = Number(order.tax || 0);
    const totalAmount = Number(order.totalAmount || 0);

    doc
      .fontSize(10)
      .font("Helvetica")
      .text("Subtotal:", 350, y, {
        width: 100,
        align: "right",
      });

    doc.text(`₹${subtotal.toFixed(2)}`, 450, y, {
      width: 100,
      align: "right",
    });

    y += 20;

    doc.text("Discount:", 350, y, {
      width: 100,
      align: "right",
    });

    doc.text(`₹${discount.toFixed(2)}`, 450, y, {
      width: 100,
      align: "right",
    });

    y += 20;

    doc.text("Delivery Fee:", 350, y, {
      width: 100,
      align: "right",
    });

    doc.text(`₹${deliveryFee.toFixed(2)}`, 450, y, {
      width: 100,
      align: "right",
    });

    y += 20;

    doc.text("Tax:", 350, y, {
      width: 100,
      align: "right",
    });

    doc.text(`₹${tax.toFixed(2)}`, 450, y, {
      width: 100,
      align: "right",
    });

    y += 25;

    doc
      .fontSize(13)
      .font("Helvetica-Bold")
      .text("Total Amount:", 330, y, {
        width: 120,
        align: "right",
      });

    doc.text(`₹${totalAmount.toFixed(2)}`, 450, y, {
      width: 100,
      align: "right",
    });

    y += 40;

    // ========================================
    // PAYMENT DETAILS
    // ========================================

    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("Payment Details", 50, y);

    y += 20;

    doc
      .fontSize(10)
      .font("Helvetica")
      .text(
        `Payment Method: ${formatPaymentMethod(
          order.paymentMethod
        )}`,
        50,
        y
      );

    y += 18;

    doc.text(
      `Payment Status: ${formatPaymentStatus(
        order.paymentStatus
      )}`,
      50,
      y
    );

    y += 18;

    doc.text(
      `Order Status: ${formatOrderStatus(
        order.orderStatus
      )}`,
      50,
      y
    );

    // ========================================
    // FOOTER
    // ========================================

    doc
      .fontSize(9)
      .font("Helvetica")
      .text(
        "Thank you for shopping with RudraGroceries!",
        50,
        750,
        {
          align: "center",
          width: 500,
        }
      );

    doc.text(
      "This is a computer-generated invoice.",
      50,
      765,
      {
        align: "center",
        width: 500,
      }
    );

    // Finish PDF
    doc.end();

  } catch (error) {
    console.error("❌ Get invoice PDF error:", error);

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
exports.getInvoiceByOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate("user", "fullName phone email");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const items = await OrderItem.find({
      order: order._id,
    }).populate("product", "name price");

    res.status(200).json({
      success: true,

      invoice: {
        invoiceNumber: order.invoiceNumber,
        invoiceGenerated: order.invoiceGenerated,
        invoiceGeneratedAt: order.invoiceGeneratedAt,

        orderNumber: order.orderNumber,
        orderDate: order.placedAt,

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

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ========================================
// Download Invoice PDF
// ========================================
exports.downloadInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate("user", "fullName phone email");

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

    const doc = new PDFDocument({
      size: "A4",
      margin: 50,
    });

    const fileName = `${order.invoiceNumber}.pdf`;

    res.setHeader("Content-Type", "application/pdf");

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileName}"`
    );

    doc.pipe(res);

    // Reuse invoice PDF content
    createInvoiceContent(doc, order, items);

    doc.end();

  } catch (error) {
    console.error("❌ Download invoice error:", error);

    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
};


// ========================================
// Get All Invoices
// ========================================
exports.getAllInvoices = async (req, res) => {
  try {
    const invoices = await Order.find({
      invoiceGenerated: true,
    })
      .populate("user", "fullName phone email")
      .sort({ invoiceGeneratedAt: -1 });

    res.status(200).json({
      success: true,
      count: invoices.length,
      invoices,
    });

  } catch (error) {
    console.error("Get all invoices error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ========================================
// Helper: Create Invoice Content
// ========================================
function createInvoiceContent(doc, order, items) {

  doc
    .fontSize(24)
    .font("Helvetica-Bold")
    .text("RudraGroceries");

  doc
    .fontSize(10)
    .font("Helvetica")
    .text("Grocery E-Commerce Store");

  doc.moveDown(1);

  doc
    .fontSize(20)
    .font("Helvetica-Bold")
    .text("INVOICE", {
      align: "right",
    });

  doc.moveDown(0.5);

  doc
    .fontSize(10)
    .font("Helvetica")
    .text(`Invoice Number: ${order.invoiceNumber}`, {
      align: "right",
    });

  doc.text(
    `Invoice Date: ${formatDate(order.invoiceGeneratedAt)}`,
    {
      align: "right",
    }
  );

  doc.text(`Order Number: ${order.orderNumber}`, {
    align: "right",
  });

  doc.text(
    `Order Date: ${formatDate(order.placedAt || order.createdAt)}`,
    {
      align: "right",
    }
  );

  doc.moveDown(2);

  const customer = order.user || {};
  const address = order.shippingAddress || {};

  doc
    .fontSize(12)
    .font("Helvetica-Bold")
    .text("Bill To:");

  doc
    .fontSize(10)
    .font("Helvetica")
    .text(customer.fullName || address.fullName || "-");

  doc.text(`Phone: ${customer.phone || address.phone || "-"}`);

  if (customer.email) {
    doc.text(`Email: ${customer.email}`);
  }

  doc.moveDown(1);

  doc
    .fontSize(12)
    .font("Helvetica-Bold")
    .text("Shipping Address:");

  doc
    .fontSize(10)
    .font("Helvetica")
    .text(address.address || "-");

  doc.text(
    `${address.city || ""}, ${address.state || ""} - ${
      address.pincode || ""
    }`
  );

  doc.moveDown(2);

  doc
    .fontSize(12)
    .font("Helvetica-Bold")
    .text("Order Items");

  doc.moveDown(0.5);

  const tableTop = doc.y;

  doc
    .fontSize(10)
    .font("Helvetica-Bold")
    .text("Product", 50, tableTop, {
      width: 230,
    });

  doc.text("Qty", 290, tableTop, {
    width: 50,
    align: "center",
  });

  doc.text("Price", 350, tableTop, {
    width: 80,
    align: "right",
  });

  doc.text("Amount", 440, tableTop, {
    width: 100,
    align: "right",
  });

  doc.moveTo(50, tableTop + 18)
    .lineTo(550, tableTop + 18)
    .stroke();

  let y = tableTop + 28;

  items.forEach((item) => {

    const productName =
      item.product?.name ||
      item.name ||
      "Product";

    const quantity =
      item.quantity ||
      item.qty ||
      1;

    const price =
      item.price ??
      item.unitPrice ??
      item.product?.price ??
      0;

    const amount =
      item.total ??
      item.totalPrice ??
      price * quantity;

    doc
      .fontSize(10)
      .font("Helvetica")
      .text(productName, 50, y, {
        width: 230,
      });

    doc.text(String(quantity), 290, y, {
      width: 50,
      align: "center",
    });

    doc.text(`₹${Number(price).toFixed(2)}`, 350, y, {
      width: 80,
      align: "right",
    });

    doc.text(`₹${Number(amount).toFixed(2)}`, 440, y, {
      width: 100,
      align: "right",
    });

    y += 25;
  });

  doc.moveTo(50, y)
    .lineTo(550, y)
    .stroke();

  y += 20;

  const subtotal = Number(order.subtotal || 0);
  const discount = Number(order.discount || 0);
  const deliveryFee = Number(order.deliveryFee || 0);
  const tax = Number(order.tax || 0);
  const totalAmount = Number(order.totalAmount || 0);

  doc
    .fontSize(10)
    .font("Helvetica")
    .text("Subtotal:", 350, y, {
      width: 100,
      align: "right",
    });

  doc.text(`₹${subtotal.toFixed(2)}`, 450, y, {
    width: 100,
    align: "right",
  });

  y += 20;

  doc.text("Discount:", 350, y, {
    width: 100,
    align: "right",
  });

  doc.text(`₹${discount.toFixed(2)}`, 450, y, {
    width: 100,
    align: "right",
  });

  y += 20;

  doc.text("Delivery Fee:", 350, y, {
    width: 100,
    align: "right",
  });

  doc.text(`₹${deliveryFee.toFixed(2)}`, 450, y, {
    width: 100,
    align: "right",
  });

  y += 20;

  doc.text("Tax:", 350, y, {
    width: 100,
    align: "right",
  });

  doc.text(`₹${tax.toFixed(2)}`, 450, y, {
    width: 100,
    align: "right",
  });

  y += 25;

  doc
    .fontSize(13)
    .font("Helvetica-Bold")
    .text("Total Amount:", 330, y, {
      width: 120,
      align: "right",
    });

  doc.text(`₹${totalAmount.toFixed(2)}`, 450, y, {
    width: 100,
    align: "right",
  });

  y += 40;

  doc
    .fontSize(12)
    .font("Helvetica-Bold")
    .text("Payment Details", 50, y);

  y += 20;

  doc
    .fontSize(10)
    .font("Helvetica")
    .text(
      `Payment Method: ${formatPaymentMethod(
        order.paymentMethod
      )}`,
      50,
      y
    );

  y += 18;

  doc.text(
    `Payment Status: ${formatPaymentStatus(
      order.paymentStatus
    )}`,
    50,
    y
  );

  y += 18;

  doc.text(
    `Order Status: ${formatOrderStatus(
      order.orderStatus
    )}`,
    50,
    y
  );

  doc
    .fontSize(9)
    .text(
      "Thank you for shopping with RudraGroceries!",
      50,
      750,
      {
        align: "center",
        width: 500,
      }
    );

  doc.text(
    "This is a computer-generated invoice.",
    50,
    765,
    {
      align: "center",
      width: 500,
    }
  );
}


// ========================================
// Helper Functions
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

  return String(method)
    .replace(/_/g, " ")
    .toUpperCase();
}

function formatPaymentStatus(status) {
  if (!status) return "-";

  return String(status)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatOrderStatus(status) {
  if (!status) return "-";

  return String(status)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}