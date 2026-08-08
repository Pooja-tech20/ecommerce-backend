const Product = require("../../models/Product");

// =========================
// Add Product
// =========================

exports.addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      price,
      originalPrice,
      stock,
      status,
      unit,
      image,
    } = req.body;

    const product = await Product.create({
      name,
      description,
      category,
      price,
      originalPrice,
      stock,
      status,
      unit,
      image,
      seller: req.seller._id,
    });

    res.status(201).json({
      success: true,
      message: "Product Added Successfully",
      product,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// =========================
// My Products
// =========================

exports.getSellerProducts = async (req, res) => {
  try {

    const products = await Product.find({
      seller: req.seller._id,
    }).populate("category");

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
exports.getSingleProduct = async (req, res) => {

  try {

    const product = await Product.findOne({
      _id: req.params.id,
      seller: req.seller._id,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

exports.updateProduct = async (req, res) => {

  try {

    const product = await Product.findOne({
      _id: req.params.id,
      seller: req.seller._id,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    Object.assign(product, req.body);

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product Updated Successfully",
      product,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

exports.deleteProduct = async (req, res) => {

  try {

    const product = await Product.findOne({
      _id: req.params.id,
      seller: req.seller._id,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product Deleted Successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};