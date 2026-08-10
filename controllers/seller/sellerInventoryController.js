const Product = require("../../models/Product");

// 📦 Add Product
exports.addProduct = async (req, res) => {
  try {
    const sellerId = req.seller._id;
    
    // Validate required fields
    const { name, description, category, price } = req.body;
    
    if (!name || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "Name, price, and category are required",
      });
    }

    const productData = {
      sellerId,
      name,
      description: description || "",
      category,
      price,
      originalPrice: req.body.originalPrice || price,
      discountPrice: req.body.discountPrice || 0,
      stock: req.body.stock || 0,
      unit: req.body.unit || "1 pc",
      images: req.body.images || [],
      image: req.body.image || (req.body.images && req.body.images[0]) || "",
      variants: req.body.variants || [],
      specifications: req.body.specifications || {},
      isActive: req.body.isActive !== undefined ? req.body.isActive : true,
      isFeatured: req.body.isFeatured || false,
    };

    const product = new Product(productData);
    await product.save();

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: product,
    });
  } catch (error) {
    console.error("Add product error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 📋 Get All Products
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
    if (category) query.category = { $regex: category, $options: "i" };
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
    console.error("Get products error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 📊 Get Product Stats
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
          outOfStock: {
            $sum: { $cond: [{ $eq: ["$status", "Out of Stock"] }, 1, 0] },
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
        stats: stats[0] || {
          totalProducts: 0,
          totalStock: 0,
          totalSold: 0,
          avgPrice: 0,
          lowStock: 0,
          outOfStock: 0,
        },
        byCategory,
      },
    });
  } catch (error) {
    console.error("Get product stats error:", error);
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
    console.error("Get product error:", error);
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

    // Allowed fields to update
    const allowedUpdates = [
      "name", "description", "category", "subCategory",
      "price", "originalPrice", "discountPrice", "stock",
      "images", "image", "unit", "variants", "specifications",
      "isActive", "isFeatured"
    ];

    const updates = {};
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Update product error:", error);
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
    console.error("Delete product error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 📦 Update Stock
exports.updateStock = async (req, res) => {
  try {
    const { stock, variantId } = req.body;
    
    if (stock === undefined || stock < 0) {
      return res.status(400).json({
        success: false,
        message: "Valid stock value is required",
      });
    }

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
      const variant = product.variants.id(variantId);
      if (!variant) {
        return res.status(404).json({
          success: false,
          message: "Variant not found",
        });
      }
      variant.stock = stock;
    } else {
      product.stock = stock;
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: "Stock updated successfully",
      data: product,
    });
  } catch (error) {
    console.error("Update stock error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 📤 Bulk Upload Products
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

    // Validate each product
    const invalidProducts = products.filter(p => !p.name || !p.price || !p.category);
    if (invalidProducts.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Each product must have name, price, and category",
        invalidCount: invalidProducts.length,
      });
    }

    // Add sellerId to each product
    const productsWithSeller = products.map((p) => ({
      ...p,
      sellerId,
      description: p.description || "",
      stock: p.stock || 0,
      images: p.images || [],
      variants: p.variants || [],
      specifications: p.specifications || {},
    }));

    const inserted = await Product.insertMany(productsWithSeller);

    res.status(201).json({
      success: true,
      message: `${inserted.length} products uploaded successfully`,
      data: inserted,
    });
  } catch (error) {
    console.error("Bulk upload error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};