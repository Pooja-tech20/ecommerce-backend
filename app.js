const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// ==================== ROUTES ====================
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

// Seller auth / dashboard / admin-management
const sellerRoutes = require("./routes/seller/sellerRoutes");
const adminSellerRoutes = require("./routes/seller/adminSellerRoutes");
const sellerDashboardRoutes = require("./routes/seller/sellerDashboardRoutes");
const sellerProductRoutes = require("./routes/seller/sellerProductRoutes");

// Individual seller module routes
const sellerInventoryRoutes = require("./routes/seller/sellerInventoryRoutes");
const sellerOrderRoutes = require("./routes/seller/sellerOrderRoutes");
const sellerEarningRoutes = require("./routes/seller/sellerEarningRoutes");
const sellerReviewRoutes = require("./routes/seller/sellerReviewRoutes");
const sellerProfileRoutes = require("./routes/seller/sellerProfileRoutes");

// Middleware
const maintenanceMode = require("./middleware/maintenanceMode");

const app = express();

// ==================== RATE LIMITER ====================
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
      "http://192.168.1.6:5173",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

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

// ==================== MAIN ROUTES ====================
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

// ==================== SELLER ROUTES ====================

// Seller auth (register/login) + dashboard + admin-side seller management
app.use("/api/seller", sellerRoutes);
app.use("/api/admin", adminSellerRoutes);
app.use("/api/seller/dashboard", sellerDashboardRoutes);
app.use("/api/seller/products", sellerProductRoutes);

// Inventory / stock tracking
app.use("/api/seller/inventory", sellerInventoryRoutes);

// Orders
app.use("/api/seller/orders", sellerOrderRoutes);

// Earnings
app.use("/api/seller/earnings", sellerEarningRoutes);

// Reviews
app.use("/api/seller/reviews", sellerReviewRoutes);

// Profile & Settings
app.use("/api/seller/profile", sellerProfileRoutes);

// ==================== 404 HANDLER ====================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});


module.exports = app;