const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");

// =========================
// Add To Wishlist
// =========================

exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    const userId = req.user._id;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = new Wishlist({
        user: userId,
        products: [],
      });
    }

    const alreadyExists = wishlist.products.find(
      (item) => item.product.toString() === productId
    );

    if (alreadyExists) {
      return res.status(400).json({
        success: false,
        message: "Product already in wishlist",
      });
    }

    wishlist.products.push({
      product: product._id,
    });

    await wishlist.save();

    res.status(200).json({
      success: true,
      message: "Product added to wishlist",
      wishlist,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Get Wishlist
// =========================

exports.getWishlist = async (req, res) => {
  try {

    const wishlist = await Wishlist.findOne({
      user: req.user._id,
    }).populate("products.product");

    res.status(200).json({
      success: true,
      wishlist,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// =========================
// Remove Product
// =========================

exports.removeWishlistItem = async (req, res) => {
  try {

    const wishlist = await Wishlist.findOne({
      user: req.user._id,
    });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found",
      });
    }

    wishlist.products = wishlist.products.filter(
      (item) => item.product.toString() !== req.params.productId
    );

    await wishlist.save();

    res.status(200).json({
      success: true,
      message: "Product removed",
      wishlist,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// =========================
// Clear Wishlist
// =========================

exports.clearWishlist = async (req, res) => {
  try {

    const wishlist = await Wishlist.findOne({
      user: req.user._id,
    });

    if (wishlist) {
      wishlist.products = [];
      await wishlist.save();
    }

    res.status(200).json({
      success: true,
      message: "Wishlist cleared",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};