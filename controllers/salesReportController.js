// // const Order = require("../models/Order");

// // exports.getSalesReport = async (req, res) => {

// //   try {

// //     const deliveredOrders = await Order.find({
// //       orderStatus: "delivered",
// //     });

// //     let totalRevenue = 0;

// //     deliveredOrders.forEach((order) => {
// //       totalRevenue += order.totalAmount;
// //     });

// //     const today = new Date();

// //     const todayRevenue = deliveredOrders
// //       .filter((o) =>

// //         o.createdAt.toDateString() ===
// //         today.toDateString()

// //       )
// //       .reduce((sum, o) => sum + o.totalAmount, 0);

// //     const report = {

// //       totalRevenue,

// //       totalOrders: deliveredOrders.length,

// //       todayRevenue,

// //       averageOrderValue:
// //         deliveredOrders.length === 0
// //           ? 0
// //           : totalRevenue /
// //             deliveredOrders.length,

// //     };

// //     res.json({

// //       success: true,

// //       report,

// //     });

// //   } catch (error) {

// //     res.status(500).json({

// //       success: false,

// //       message: error.message,

// //     });

// //   }

// // };

// const Order = require("../models/Order");
// const OrderItem = require("../models/OrderItem");
// const mongoose = require("mongoose");

// exports.getSalesReport = async (req, res) => {

//   try {

//     const deliveredOrders = await Order.find({
//       orderStatus: "delivered",
//     });

//     let totalRevenue = 0;

//     deliveredOrders.forEach((order) => {
//       totalRevenue += order.totalAmount;
//     });

//     const today = new Date();

//     const todayRevenue = deliveredOrders
//       .filter((o) =>

//         o.createdAt.toDateString() ===
//         today.toDateString()

//       )
//       .reduce((sum, o) => sum + o.totalAmount, 0);

//     const report = {

//       totalRevenue,

//       totalOrders: deliveredOrders.length,

//       todayRevenue,

//       averageOrderValue:
//         deliveredOrders.length === 0
//           ? 0
//           : totalRevenue /
//             deliveredOrders.length,

//     };

//     res.json({

//       success: true,

//       report,

//     });

//   } catch (error) {

//     res.status(500).json({

//       success: false,

//       message: error.message,

//     });

//   }

// };

// // ==========================================================
// // Detailed Sales Report (tabular, date-wise + category-wise)
// // GET /api/admin/sales-report/table
// //
// // Query params (all optional):
// //   startDate   - ISO date, inclusive lower bound on order date
// //   endDate     - ISO date, inclusive upper bound on order date
// //   category    - Product category ObjectId, filters rows to that category
// //   orderStatus - e.g. "delivered", "placed" ... filters by order status
// //   sortBy      - "date" (default) or "category"
// //   sortOrder   - "asc" or "desc" (default: "desc" for date, "asc" for category)
// //
// // Returns one row per order-item (product line), which is what makes a
// // "category wise" and "date wise" tabular report possible/meaningful —
// // an order can contain products from several categories.
// // ==========================================================
// exports.getDetailedReport = async (req, res) => {
//   try {
//     const { startDate, endDate, category, orderStatus, sortBy, sortOrder } = req.query;

//     const matchStage = {};

//     // ---- Date filter (applied to the order's createdAt) ----
//     const dateFilter = {};
//     if (startDate) dateFilter.$gte = new Date(startDate);
//     if (endDate) {
//       // Make the end date inclusive of the whole day
//       const end = new Date(endDate);
//       end.setHours(23, 59, 59, 999);
//       dateFilter.$lte = end;
//     }

//     const pipeline = [
//       {
//         $lookup: {
//           from: "orders",
//           localField: "order",
//           foreignField: "_id",
//           as: "orderInfo",
//         },
//       },
//       { $unwind: "$orderInfo" },
//       {
//         $lookup: {
//           from: "products",
//           localField: "product",
//           foreignField: "_id",
//           as: "productInfo",
//         },
//       },
//       { $unwind: { path: "$productInfo", preserveNullAndEmptyArrays: true } },
//       {
//         $lookup: {
//           from: "categories",
//           localField: "productInfo.category",
//           foreignField: "_id",
//           as: "categoryInfo",
//         },
//       },
//       { $unwind: { path: "$categoryInfo", preserveNullAndEmptyArrays: true } },
//       {
//         $lookup: {
//           from: "users",
//           localField: "orderInfo.user",
//           foreignField: "_id",
//           as: "userInfo",
//         },
//       },
//       { $unwind: { path: "$userInfo", preserveNullAndEmptyArrays: true } },
//     ];

//     if (Object.keys(dateFilter).length > 0) {
//       matchStage["orderInfo.createdAt"] = dateFilter;
//     }
//     if (orderStatus) {
//       matchStage["orderInfo.orderStatus"] = orderStatus;
//     }
//     if (category && mongoose.Types.ObjectId.isValid(category)) {
//       matchStage["productInfo.category"] = new mongoose.Types.ObjectId(category);
//     }

//     if (Object.keys(matchStage).length > 0) {
//       pipeline.push({ $match: matchStage });
//     }

//     pipeline.push({
//       $project: {
//         _id: 0,
//         orderItemId: "$_id",
//         date: "$orderInfo.createdAt",
//         orderId: "$orderInfo._id",
//         orderNumber: "$orderInfo.orderNumber",
//         orderStatus: "$orderInfo.orderStatus",
//         customerName: { $ifNull: ["$userInfo.fullName", "Guest"] },
//         customerEmail: "$userInfo.email",
//         productName: "$productName",
//         category: { $ifNull: ["$categoryInfo.name", "Uncategorized"] },
//         categoryId: "$categoryInfo._id",
//         quantity: "$quantity",
//         price: "$price",
//         subtotal: "$subtotal",
//       },
//     });

//     // ---- Sorting ----
//     const sortField = sortBy === "category" ? "category" : "date";
//     const direction = sortOrder === "asc" ? 1 : sortOrder === "desc" ? -1 : sortField === "date" ? -1 : 1;
//     pipeline.push({ $sort: { [sortField]: direction, date: -1 } });

//     const rows = await OrderItem.aggregate(pipeline);

//     const totalAmount = rows.reduce((sum, r) => sum + (r.subtotal || 0), 0);
//     const totalQuantity = rows.reduce((sum, r) => sum + (r.quantity || 0), 0);

//     res.status(200).json({
//       success: true,
//       count: rows.length,
//       totalAmount,
//       totalQuantity,
//       rows,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Product = require("../models/Product");
const Category = require("../models/Category");
const User = require("../models/User");
const mongoose = require("mongoose");
const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");
const moment = require("moment");

exports.getSalesReport = async (req, res) => {
  try {
    const deliveredOrders = await Order.find({
      orderStatus: "delivered",
    });

    let totalRevenue = 0;
    deliveredOrders.forEach((order) => {
      totalRevenue += order.totalAmount;
    });

    const today = new Date();
    const todayRevenue = deliveredOrders
      .filter((o) => o.createdAt.toDateString() === today.toDateString())
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const report = {
      totalRevenue,
      totalOrders: deliveredOrders.length,
      todayRevenue,
      averageOrderValue: deliveredOrders.length === 0 ? 0 : totalRevenue / deliveredOrders.length,
    };

    res.json({
      success: true,
      report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================================
// Enhanced Detailed Sales Report with all filters
// GET /api/admin/sales-report/detailed
// ==========================================================
exports.getDetailedReport = async (req, res) => {
  try {
    const { 
      startDate, 
      endDate, 
      category, 
      productId,
      customerId,
      orderStatus, 
      sortBy, 
      sortOrder,
      reportType = 'summary' // summary, category-wise, product-wise, customer-wise
    } = req.query;

    const matchStage = {};

    // Date filter
    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      dateFilter.$lte = end;
    }

    // Build pipeline for OrderItem aggregation
    const pipeline = [
      {
        $lookup: {
          from: "orders",
          localField: "order",
          foreignField: "_id",
          as: "orderInfo",
        },
      },
      { $unwind: "$orderInfo" },
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "productInfo",
        },
      },
      { $unwind: { path: "$productInfo", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "categories",
          localField: "productInfo.category",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      { $unwind: { path: "$categoryInfo", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "users",
          localField: "orderInfo.user",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      { $unwind: { path: "$userInfo", preserveNullAndEmptyArrays: true } },
    ];

    // Apply filters
    if (Object.keys(dateFilter).length > 0) {
      matchStage["orderInfo.createdAt"] = dateFilter;
    }
    if (orderStatus) {
      matchStage["orderInfo.orderStatus"] = orderStatus;
    }
    if (category && mongoose.Types.ObjectId.isValid(category)) {
      matchStage["productInfo.category"] = new mongoose.Types.ObjectId(category);
    }
    if (productId && mongoose.Types.ObjectId.isValid(productId)) {
      matchStage["productInfo._id"] = new mongoose.Types.ObjectId(productId);
    }
    if (customerId && mongoose.Types.ObjectId.isValid(customerId)) {
      matchStage["orderInfo.user"] = new mongoose.Types.ObjectId(customerId);
    }

    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }

    // Project the fields
    pipeline.push({
      $project: {
        _id: 0,
        orderItemId: "$_id",
        date: "$orderInfo.createdAt",
        orderId: "$orderInfo._id",
        orderNumber: "$orderInfo.orderNumber",
        orderStatus: "$orderInfo.orderStatus",
        paymentMethod: "$orderInfo.paymentMethod",
        customerName: { $ifNull: ["$userInfo.fullName", "Guest"] },
        customerEmail: "$userInfo.email",
        customerId: "$userInfo._id",
        productId: "$productInfo._id",
        productName: "$productName",
        productSku: "$productInfo.sku",
        category: { $ifNull: ["$categoryInfo.name", "Uncategorized"] },
        categoryId: "$categoryInfo._id",
        quantity: "$quantity",
        price: "$price",
        subtotal: "$subtotal",
        totalAmount: "$orderInfo.totalAmount",
      },
    });

    // ---- Sorting ----
    const sortField = sortBy === "category" ? "category" : sortBy === "product" ? "productName" : "date";
    const direction = sortOrder === "asc" ? 1 : sortOrder === "desc" ? -1 : sortField === "date" ? -1 : 1;
    pipeline.push({ $sort: { [sortField]: direction, date: -1 } });

    const rows = await OrderItem.aggregate(pipeline);

    // Calculate summary stats
    const totalRevenue = rows.reduce((sum, r) => sum + (r.subtotal || 0), 0);
    const totalQuantity = rows.reduce((sum, r) => sum + (r.quantity || 0), 0);
    const totalOrders = new Set(rows.map(r => r.orderId.toString())).size;

    // Generate report based on type
    let reportData;
    switch(reportType) {
      case 'category-wise':
        reportData = generateCategoryWiseReport(rows);
        break;
      case 'product-wise':
        reportData = generateProductWiseReport(rows);
        break;
      case 'customer-wise':
        reportData = generateCustomerWiseReport(rows);
        break;
      default:
        reportData = {
          reportType: 'summary',
          summary: {
            totalRevenue,
            totalQuantity,
            totalOrders,
            averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0
          },
          orders: rows
        };
    }

    res.status(200).json({
      success: true,
      count: rows.length,
      totalRevenue,
      totalQuantity,
      totalOrders,
      reportData,
      rows: reportType === 'summary' ? rows : undefined
    });
  } catch (error) {
    console.error('Detailed report error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================================
// Generate Category-wise Report
// ==========================================================
function generateCategoryWiseReport(rows) {
  const categoryMap = new Map();

  rows.forEach(row => {
    const categoryKey = row.categoryId ? row.categoryId.toString() : 'uncategorized';
    
    if (!categoryMap.has(categoryKey)) {
      categoryMap.set(categoryKey, {
        categoryId: categoryKey,
        categoryName: row.category || 'Uncategorized',
        revenue: 0,
        quantity: 0,
        orders: new Set(),
        products: new Set()
      });
    }

    const data = categoryMap.get(categoryKey);
    data.revenue += row.subtotal || 0;
    data.quantity += row.quantity || 0;
    if (row.orderId) data.orders.add(row.orderId.toString());
    if (row.productId) data.products.add(row.productId.toString());
  });

  const categoryData = Array.from(categoryMap.values()).map(item => ({
    ...item,
    orders: item.orders.size,
    products: item.products.size
  }));

  return {
    reportType: 'category-wise',
    data: categoryData.sort((a, b) => b.revenue - a.revenue),
    summary: {
      totalRevenue: categoryData.reduce((sum, item) => sum + item.revenue, 0),
      totalQuantity: categoryData.reduce((sum, item) => sum + item.quantity, 0),
      totalCategories: categoryData.length
    }
  };
}

// ==========================================================
// Generate Product-wise Report
// ==========================================================
function generateProductWiseReport(rows) {
  const productMap = new Map();

  rows.forEach(row => {
    const productKey = row.productId ? row.productId.toString() : 'unknown';
    
    if (!productMap.has(productKey)) {
      productMap.set(productKey, {
        productId: productKey,
        productName: row.productName || 'Unknown Product',
        sku: row.productSku || 'N/A',
        category: row.category || 'Uncategorized',
        revenue: 0,
        quantity: 0,
        orders: new Set(),
        averagePrice: 0
      });
    }

    const data = productMap.get(productKey);
    data.revenue += row.subtotal || 0;
    data.quantity += row.quantity || 0;
    if (row.orderId) data.orders.add(row.orderId.toString());
  });

  const productData = Array.from(productMap.values()).map(item => ({
    ...item,
    orders: item.orders.size,
    averagePrice: item.quantity > 0 ? item.revenue / item.quantity : 0
  }));

  return {
    reportType: 'product-wise',
    data: productData.sort((a, b) => b.revenue - a.revenue),
    summary: {
      totalRevenue: productData.reduce((sum, item) => sum + item.revenue, 0),
      totalQuantity: productData.reduce((sum, item) => sum + item.quantity, 0),
      totalProducts: productData.length
    }
  };
}

// ==========================================================
// Generate Customer-wise Report
// ==========================================================
function generateCustomerWiseReport(rows) {
  const customerMap = new Map();

  rows.forEach(row => {
    const customerKey = row.customerId ? row.customerId.toString() : 'guest';
    
    if (!customerMap.has(customerKey)) {
      customerMap.set(customerKey, {
        customerId: customerKey,
        customerName: row.customerName || 'Guest',
        customerEmail: row.customerEmail || 'N/A',
        totalSpent: 0,
        totalOrders: new Set(),
        averageOrderValue: 0,
        lastOrderDate: null
      });
    }

    const data = customerMap.get(customerKey);
    data.totalSpent += row.subtotal || 0;
    if (row.orderId) data.totalOrders.add(row.orderId.toString());
    
    if (!data.lastOrderDate || (row.date && row.date > data.lastOrderDate)) {
      data.lastOrderDate = row.date;
    }
  });

  const customerData = Array.from(customerMap.values()).map(item => ({
    ...item,
    totalOrders: item.totalOrders.size,
    averageOrderValue: item.totalOrders.size > 0 ? item.totalSpent / item.totalOrders.size : 0
  }));

  return {
    reportType: 'customer-wise',
    data: customerData.sort((a, b) => b.totalSpent - a.totalSpent),
    summary: {
      totalCustomers: customerData.length,
      totalRevenue: customerData.reduce((sum, item) => sum + item.totalSpent, 0),
      averageCustomerValue: customerData.length > 0 ? 
        customerData.reduce((sum, item) => sum + item.totalSpent, 0) / customerData.length : 0
    }
  };
}

// ==========================================================
// Export to Excel
// POST /api/admin/sales-report/export/excel
// ==========================================================
exports.exportToExcel = async (req, res) => {
  try {
    const { rows, reportType, summary } = req.body;

    if (!rows || rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No data to export'
      });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sales Report');

    // Add title
    worksheet.mergeCells('A1:I1');
    worksheet.getCell('A1').value = 'SALES REPORT';
    worksheet.getCell('A1').font = { size: 16, bold: true };
    worksheet.getCell('A1').alignment = { horizontal: 'center' };

    // Add generation date
    worksheet.mergeCells('A2:I2');
    worksheet.getCell('A2').value = `Generated: ${moment().format('YYYY-MM-DD HH:mm:ss')}`;
    worksheet.getCell('A2').alignment = { horizontal: 'center' };

    // Add summary section
    if (summary) {
      const summaryStartRow = 4;
      worksheet.addRow(['REPORT SUMMARY']);
      worksheet.getCell(`A${summaryStartRow}`).font = { bold: true, size: 12 };
      
      const summaryData = [
        ['Total Revenue', `$${summary.totalRevenue?.toFixed(2) || '0.00'}`],
        ['Total Orders', summary.totalOrders || 0],
        ['Total Quantity', summary.totalQuantity || 0],
        ['Average Order Value', `$${summary.averageOrderValue?.toFixed(2) || '0.00'}`]
      ];

      if (reportType === 'category-wise') {
        summaryData.push(['Total Categories', summary.totalCategories || 0]);
      } else if (reportType === 'product-wise') {
        summaryData.push(['Total Products', summary.totalProducts || 0]);
      } else if (reportType === 'customer-wise') {
        summaryData.push(['Total Customers', summary.totalCustomers || 0]);
        summaryData.push(['Average Customer Value', `$${summary.averageCustomerValue?.toFixed(2) || '0.00'}`]);
      }

      summaryData.forEach((row, index) => {
        const rowNum = summaryStartRow + 1 + index;
        worksheet.addRow(row);
        worksheet.getCell(`A${rowNum}`).font = { bold: true };
      });

      // Add empty row
      const dataStartRow = summaryStartRow + summaryData.length + 2;
      worksheet.addRow([]);
    }

    // Add headers based on report type
    let headers = [];
    let dataStartRow = 8; // Default

    if (reportType === 'category-wise') {
      headers = ['Category', 'Revenue', 'Quantity', 'Orders', 'Products'];
      dataStartRow = 8;
    } else if (reportType === 'product-wise') {
      headers = ['Product', 'SKU', 'Category', 'Revenue', 'Quantity', 'Orders', 'Avg Price'];
      dataStartRow = 8;
    } else if (reportType === 'customer-wise') {
      headers = ['Customer', 'Email', 'Total Spent', 'Total Orders', 'Avg Order Value', 'Last Order'];
      dataStartRow = 8;
    } else {
      headers = [
        'Order ID', 'Date', 'Customer', 'Email', 'Product', 
        'Category', 'Quantity', 'Price', 'Subtotal', 'Total', 'Status'
      ];
      dataStartRow = 8;
    }

    const headerRow = worksheet.addRow(headers);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4CAF50' }
    };

    // Add data rows
    let dataRows;
    if (reportType === 'category-wise') {
      dataRows = rows.map(r => [
        r.categoryName,
        r.revenue.toFixed(2),
        r.quantity,
        r.orders,
        r.products
      ]);
    } else if (reportType === 'product-wise') {
      dataRows = rows.map(r => [
        r.productName,
        r.sku,
        r.category,
        r.revenue.toFixed(2),
        r.quantity,
        r.orders,
        r.averagePrice.toFixed(2)
      ]);
    } else if (reportType === 'customer-wise') {
      dataRows = rows.map(r => [
        r.customerName,
        r.customerEmail,
        r.totalSpent.toFixed(2),
        r.totalOrders,
        r.averageOrderValue.toFixed(2),
        r.lastOrderDate ? moment(r.lastOrderDate).format('YYYY-MM-DD') : 'N/A'
      ]);
    } else {
      dataRows = rows.map(r => [
        r.orderNumber || r.orderId?.toString().slice(-8) || 'N/A',
        moment(r.date).format('YYYY-MM-DD HH:mm'),
        r.customerName,
        r.customerEmail,
        r.productName,
        r.category,
        r.quantity,
        `$${r.price?.toFixed(2) || '0.00'}`,
        `$${r.subtotal?.toFixed(2) || '0.00'}`,
        `$${r.totalAmount?.toFixed(2) || '0.00'}`,
        r.orderStatus
      ]);
    }

    dataRows.forEach(row => worksheet.addRow(row));

    // Auto-fit columns
    worksheet.columns.forEach(column => {
      let maxLength = 10;
      column.eachCell({ includeEmpty: true }, cell => {
        const cellValue = cell.value ? cell.value.toString() : '';
        maxLength = Math.max(maxLength, cellValue.length + 5);
      });
      column.width = Math.min(maxLength, 30);
    });

    // Set response headers
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=sales-report-${moment().format('YYYY-MM-DD')}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error('Excel export error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export Excel file',
      error: error.message
    });
  }
};

// ==========================================================
// Export to PDF
// POST /api/admin/sales-report/export/pdf
// ==========================================================
exports.exportToPDF = async (req, res) => {
  try {
    const { rows, reportType, summary } = req.body;

    if (!rows || rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No data to export'
      });
    }

    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=sales-report-${moment().format('YYYY-MM-DD')}.pdf`
    );

    doc.pipe(res);

    // Title
    doc.fontSize(20)
       .font('Helvetica-Bold')
       .text('SALES REPORT', { align: 'center' });
    
    doc.moveDown(0.5);
    
    doc.fontSize(10)
       .font('Helvetica')
       .text(`Generated: ${moment().format('YYYY-MM-DD HH:mm:ss')}`, { align: 'center' });
    
    doc.moveDown(1);

    // Summary section
    if (summary) {
      doc.fontSize(14)
         .font('Helvetica-Bold')
         .text('Summary');
      
      doc.moveDown(0.5);
      
      doc.fontSize(10)
         .font('Helvetica');
      
      const summaryItems = [
        `Total Revenue: $${summary.totalRevenue?.toFixed(2) || '0.00'}`,
        `Total Orders: ${summary.totalOrders || 0}`,
        `Total Quantity: ${summary.totalQuantity || 0}`,
        `Average Order Value: $${summary.averageOrderValue?.toFixed(2) || '0.00'}`
      ];

      if (reportType === 'category-wise') {
        summaryItems.push(`Total Categories: ${summary.totalCategories || 0}`);
      } else if (reportType === 'product-wise') {
        summaryItems.push(`Total Products: ${summary.totalProducts || 0}`);
      } else if (reportType === 'customer-wise') {
        summaryItems.push(`Total Customers: ${summary.totalCustomers || 0}`);
        summaryItems.push(`Average Customer Value: $${summary.averageCustomerValue?.toFixed(2) || '0.00'}`);
      }

      summaryItems.forEach(item => doc.text(item));
      doc.moveDown(1);
    }

    // Table
    doc.fontSize(12)
       .font('Helvetica-Bold')
       .text('Details');
    
    doc.moveDown(0.5);

    // Define table structure based on report type
    let headers, columns;
    if (reportType === 'category-wise') {
      headers = ['Category', 'Revenue', 'Qty', 'Orders', 'Products'];
      columns = [
        { key: 'categoryName', width: 120 },
        { key: 'revenue', width: 80 },
        { key: 'quantity', width: 60 },
        { key: 'orders', width: 60 },
        { key: 'products', width: 60 }
      ];
    } else if (reportType === 'product-wise') {
      headers = ['Product', 'SKU', 'Category', 'Revenue', 'Qty', 'Orders'];
      columns = [
        { key: 'productName', width: 100 },
        { key: 'sku', width: 60 },
        { key: 'category', width: 80 },
        { key: 'revenue', width: 80 },
        { key: 'quantity', width: 60 },
        { key: 'orders', width: 60 }
      ];
    } else if (reportType === 'customer-wise') {
      headers = ['Customer', 'Email', 'Total Spent', 'Orders', 'Avg Order'];
      columns = [
        { key: 'customerName', width: 100 },
        { key: 'customerEmail', width: 120 },
        { key: 'totalSpent', width: 80 },
        { key: 'totalOrders', width: 60 },
        { key: 'averageOrderValue', width: 80 }
      ];
    } else {
      headers = ['Order', 'Date', 'Customer', 'Product', 'Qty', 'Amount'];
      columns = [
        { key: 'orderNumber', width: 60 },
        { key: 'date', width: 80 },
        { key: 'customerName', width: 80 },
        { key: 'productName', width: 80 },
        { key: 'quantity', width: 50 },
        { key: 'subtotal', width: 60 }
      ];
    }

    // Draw table headers
    let y = doc.y;
    const xPositions = [50];
    let currentX = 50;
    columns.forEach((col, index) => {
      xPositions.push(currentX + col.width);
      currentX += col.width;
    });

    doc.font('Helvetica-Bold');
    headers.forEach((header, i) => {
      doc.text(header, xPositions[i], y, { 
        width: columns[i].width, 
        align: 'left',
        ellipsis: true 
      });
    });

    // Draw header line
    doc.moveDown();
    doc.lineWidth(1)
       .moveTo(50, doc.y)
       .lineTo(50 + columns.reduce((sum, c) => sum + c.width, 0), doc.y)
       .stroke();

    // Draw data rows
    doc.font('Helvetica');
    const displayRows = rows.slice(0, 20); // Limit to 20 rows for PDF readability
    
    displayRows.forEach(row => {
      if (doc.y > 700) {
        doc.addPage();
        y = 50;
        // Redraw headers on new page
        doc.font('Helvetica-Bold');
        headers.forEach((header, i) => {
          doc.text(header, xPositions[i], y, { width: columns[i].width, align: 'left' });
        });
        doc.moveDown();
        doc.lineWidth(1)
           .moveTo(50, doc.y)
           .lineTo(50 + columns.reduce((sum, c) => sum + c.width, 0), doc.y)
           .stroke();
        doc.font('Helvetica');
      }

      columns.forEach((col, i) => {
        let value = row[col.key];
        if (col.key === 'revenue' || col.key === 'totalSpent' || col.key === 'subtotal') {
          value = `$${value?.toFixed(2) || '0.00'}`;
        } else if (col.key === 'averageOrderValue') {
          value = `$${value?.toFixed(2) || '0.00'}`;
        } else if (col.key === 'date') {
          value = moment(value).format('MM/DD/YY');
        } else if (col.key === 'orderNumber') {
          value = value?.toString().slice(-8) || 'N/A';
        }
        doc.text(value || 'N/A', xPositions[i], doc.y, { 
          width: columns[i].width, 
          align: 'left',
          ellipsis: true 
        });
      });
      doc.moveDown();
    });

    // Add footer
    doc.moveDown(2);
    doc.fontSize(8)
       .font('Helvetica')
       .text(`Page ${doc.page}`, { align: 'center' });

    doc.end();

  } catch (error) {
    console.error('PDF export error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export PDF file',
      error: error.message
    });
  }
};