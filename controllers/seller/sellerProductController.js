const SellerProduct = require("../../models/seller/Product");

// ==============================
// Add Product
// ==============================
exports.addProduct = async (req, res) => {
  try {
    const sellerId = req.seller._id;

    const {
      name,
      description,
      category,
      subCategory,
      price,
      discountPrice,
      stock,
      images,
      variants,
      specifications,
      isActive,
      isFeatured,
    } = req.body;

    const product = await SellerProduct.create({
      sellerId,
      name,
      description,
      category,
      subCategory,
      price,
      discountPrice,
      stock,
      images,
      variants,
      specifications,
      isActive,
      isFeatured,
    });

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    console.error("Add Product Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Get Seller Products
// ==============================
exports.getSellerProducts = async (req, res) => {
  try {
    const sellerId = req.seller._id;

    const products = await SellerProduct.find({
      sellerId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Get Products Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Get Single Product
// ==============================
exports.getSingleProduct = async (req, res) => {
  try {
    const sellerId = req.seller._id;

    const product = await SellerProduct.findOne({
      _id: req.params.id,
      sellerId,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Get Single Product Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Update Product
// ==============================
exports.updateProduct = async (req, res) => {
  try {
    const sellerId = req.seller._id;

    const product = await SellerProduct.findOneAndUpdate(
      {
        _id: req.params.id,
        sellerId,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Update Product Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Delete Product
// ==============================
exports.deleteProduct = async (req, res) => {
  try {
    const sellerId = req.seller._id;

    const product = await SellerProduct.findOneAndDelete({
      _id: req.params.id,
      sellerId,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete Product Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};