const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// Test Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Grocery E-Commerce API 🚀",
  });
});
app.use("/api/auth", authRoutes);


module.exports = app;