const Product = require("../models/Product");

// ============================
// Get Inventory List
// ============================
exports.getInventory = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      category,
      status,
      sort = "createdAt",
    } = req.query;

    const query = {};

    // Search
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // Category Filter
    if (category) {
      query.category = category;
    }

    // Stock Status Filter
    if (status === "in-stock") {
      query.stock = { $gt: 5 };
    }

    if (status === "low-stock") {
      query.stock = { $gt: 0, $lte: 5 };
    }

    if (status === "out-of-stock") {
      query.stock = 0;
    }

    const totalProducts = await Product.countDocuments(query);

    const products = await Product.find(query)
      .populate("category", "name")
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const inventory = products.map((product) => ({
      ...product.toObject(),
      stockStatus:
        product.stock === 0
          ? "Out of Stock"
          : product.stock <= 5
          ? "Low Stock"
          : "In Stock",
    }));

    res.status(200).json({
      success: true,
      totalProducts,
      currentPage: Number(page),
      totalPages: Math.ceil(totalProducts / limit),
      inventory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================
// Inventory Statistics
// ============================
exports.getInventoryStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();

    const inStock = await Product.countDocuments({
      stock: { $gt: 5 },
    });

    const lowStock = await Product.countDocuments({
      stock: { $gt: 0, $lte: 5 },
    });

    const outOfStock = await Product.countDocuments({
      stock: 0,
    });

    res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        inStock,
        lowStock,
        outOfStock,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================
// Update Product Stock
// ============================
exports.updateStock = async (req, res) => {
  try {
    const { stock } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.stock = stock;

    await product.save();

    res.status(200).json({
      success: true,
      message: "Stock updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================
// Low Stock Products
// ============================
exports.getLowStockProducts = async (req, res) => {
  try {
    const products = await Product.find({
      stock: { $gt: 0, $lte: 5 },
    }).populate("category", "name");

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================
// Out of Stock Products
// ============================
exports.getOutOfStockProducts = async (req, res) => {
  try {
    const products = await Product.find({
      stock: 0,
    }).populate("category", "name");

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};