const Product = require("../../models/Product");
const mongoose = require("mongoose");

// 📦 Add Product
exports.addProduct = async (req, res) => {
  try {
    const sellerId = req.seller._id;
    const productData = {
      ...req.body,
      sellerId,
      variants: req.body.variants || [],
      specifications: req.body.specifications || {},
    };

    // Validate required fields
    if (!productData.name || !productData.price || !productData.category) {
      return res.status(400).json({
        success: false,
        message: "Name, price, and category are required",
      });
    }

    const product = new Product(productData);
    await product.save();

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 📋 Get All Products (with filters)
exports.getProducts = async (req, res) => {
  try {
    const sellerId = req.seller._id;
    const { page = 1, limit = 10, search, category, isActive } = req.query;

    const query = { sellerId };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (category) query.category = category;
    if (isActive !== undefined) query.isActive = isActive === "true";

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 🔍 Get Single Product
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      sellerId: req.seller._id,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✏️ Update Product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      sellerId: req.seller._id,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 🗑️ Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      sellerId: req.seller._id,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 📊 Update Stock
exports.updateStock = async (req, res) => {
  try {
    const { stock, variantId } = req.body;
    
    const product = await Product.findOne({
      _id: req.params.id,
      sellerId: req.seller._id,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (variantId) {
      // Update specific variant stock
      const variant = product.variants.id(variantId);
      if (!variant) {
        return res.status(404).json({
          success: false,
          message: "Variant not found",
        });
      }
      variant.stock = stock;
    } else {
      // Update main stock
      product.stock = stock;
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: "Stock updated successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 🔄 Bulk Upload Products
exports.bulkUpload = async (req, res) => {
  try {
    const sellerId = req.seller._id;
    const products = req.body.products || [];

    if (!products.length) {
      return res.status(400).json({
        success: false,
        message: "No products to upload",
      });
    }

    // Add sellerId to each product
    const productsWithSeller = products.map((p) => ({
      ...p,
      sellerId,
    }));

    const inserted = await Product.insertMany(productsWithSeller);

    res.status(201).json({
      success: true,
      message: `${inserted.length} products uploaded successfully`,
      data: inserted,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 📊 Product Stats
exports.getProductStats = async (req, res) => {
  try {
    const sellerId = req.seller._id;

    const stats = await Product.aggregate([
      { $match: { sellerId: sellerId } },
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          totalStock: { $sum: "$stock" },
          totalSold: { $sum: "$soldCount" },
          avgPrice: { $avg: "$price" },
          lowStock: {
            $sum: { $cond: [{ $lt: ["$stock", 10] }, 1, 0] },
          },
        },
      },
    ]);

    const byCategory = await Product.aggregate([
      { $match: { sellerId: sellerId } },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        stats: stats[0] || {},
        byCategory,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};