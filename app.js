// const express = require("express");
// const cors = require("cors");
// const helmet = require("helmet");
// const rateLimit = require("express-rate-limit");

// const authRoutes = require("./routes/authRoutes");
// const adminRoutes = require("./routes/adminRoutes");
// const categoryRoutes = require("./routes/categoryRoutes");
// const productRoutes = require("./routes/productRoutes");
// const cartRoutes = require("./routes/cartRoutes");

// const userRoutes = require("./routes/userRoutes");

// const orderRoutes = require("./routes/orderRoutes");
// const addressRoutes = require("./routes/addressRoutes");
// const wishlistRoutes = require("./routes/wishlistRoutes");
// const adminAccessRoutes = require("./routes/adminaccessRoutes");

// const reviewRoutes = require("./routes/reviewRoutes");
// const productSearchRoutes = require("./routes/productSearchRoutes");
// const notificationRoutes = require("./routes/notificationRoutes");

// const trackingRoutes = require("./routes/trackingRoutes");

// const inventoryRoutes = require("./routes/inventoryRoutes");
// const adminUserRoutes = require("./routes/adminUserRoutes");
// const salesReportRoutes = require("./routes/salesReportRoutes");
// const adminAnalyticsRoutes = require("./routes/adminAnalyticsRoutes");
// const pageRoutes = require("./routes/pageRoutes");
// const bannerRoutes = require("./routes/bannerRoutes");
// const settingsRoutes = require("./routes/settingsRoutes");
// const invoiceRoutes = require("./routes/invoiceRoutes");
// const otpRoutes = require("./routes/otpRoutes");
// const maintainceMode = require("./routes/maintainaceRoutes")
// const app = express();

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 1000,
//   message: {
//     success: false,
//     message: "Too many requests. Please try again after 15 minutes.",
//   },
//   standardHeaders: true,
//   legacyHeaders: false,
// });

// app.use(
//   helmet({
//     crossOriginResourcePolicy: false,
//   })
// );
// app.use(limiter);
// // Middleware
// app.use(
//   cors({
//     origin: [
//       "http://localhost:5173",
//       "http://127.0.0.1:5173",
//       "http://192.168.1.24:5173",
//       "http://192.168.1.28:5173"
//     ],
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );


// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.use(maintenanceMode);
// app.use("/uploads", express.static("uploads"));


// // Test Route
// app.get("/", (req, res) => {
//   res.json({
//     success: true,
//     message: "Welcome to Grocery E-Commerce API 🚀",
//   });
// });

// app.use("/api/auth", authRoutes);
// app.use("/api/admin", adminRoutes);
// app.use("/api/categories", categoryRoutes);
// app.use("/api/products", productRoutes);
// app.use("/api/cart", cartRoutes);
// app.use("/api/orders", orderRoutes);

// app.use("/api/users", userRoutes);
// app.use("/api/address", addressRoutes);
// app.use("/api/wishlist", wishlistRoutes);
// app.use("/api/admin-access", adminAccessRoutes);
// app.use("/api/product-search", productSearchRoutes);
// app.use("/api/notifications", notificationRoutes);
// app.use("/api/tracking", trackingRoutes);


// app.use("/api/reviews", reviewRoutes);
// app.use("/api/inventory", inventoryRoutes);
// app.use("/api/admin/users", adminUserRoutes);
// app.use("/api/admin/sales-report",salesReportRoutes);
// app.use("/api/admin/analytics", adminAnalyticsRoutes);
// app.use("/api/pages", pageRoutes);
// app.use("/api/banners", bannerRoutes);
// app.use("/api/settings", settingsRoutes);
// app.use("/api/invoice", invoiceRoutes);
// app.use("/api/otp", otpRoutes);

// module.exports = app;
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// Routes
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const addressRoutes = require("./routes/addressRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const adminAccessRoutes = require("./routes/adminaccessRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const productSearchRoutes = require("./routes/productSearchRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const trackingRoutes = require("./routes/trackingRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const adminUserRoutes = require("./routes/adminUserRoutes");
const salesReportRoutes = require("./routes/salesReportRoutes");
const adminAnalyticsRoutes = require("./routes/adminAnalyticsRoutes");
const pageRoutes = require("./routes/pageRoutes");
const bannerRoutes = require("./routes/bannerRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const otpRoutes = require("./routes/otpRoutes");
const sellerRoutes = require("./routes/sellerRoutes");

// Middleware
const maintenanceMode = require("./middleware/maintenanceMode");

const app = express();

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: {
    success: false,
    message: "Too many requests. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(limiter);

app.use(
  cors({
     origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://192.168.1.24:5173",
    
  ],
  
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Uploads
app.use("/uploads", express.static("uploads"));

// Maintenance Mode Middleware
app.use(maintenanceMode);

// Test Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Grocery E-Commerce API 🚀",
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/admin-access", adminAccessRoutes);
app.use("/api/product-search", productSearchRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/tracking", trackingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/admin/sales-report", salesReportRoutes);
app.use("/api/admin/analytics", adminAnalyticsRoutes);
app.use("/api/pages", pageRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/invoice", invoiceRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/seller", sellerRoutes);

module.exports = app;