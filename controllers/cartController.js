const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Add To Cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: [],
      });
    }

    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += Number(quantity);
    } else {
      cart.items.push({
        product: product._id,
        quantity: Number(quantity),
        priceAtAdd: product.price,
      });
    }

    await cart.save();

    res.json({
      success: true,
      cart,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get Cart
exports.getCart = async (req, res) => {
  try {

    const cart = await Cart.findOne({
      user: req.user._id,
    }).populate("items.product");

    res.json({
      success: true,
      cart,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Update Cart
exports.updateCart = async (req, res) => {
  res.json({
    success: true,
    message: "Update Cart Working",
  });
};

// Remove Cart Item
exports.removeCartItem = async (req, res) => {
  res.json({
    success: true,
    message: "Remove Item Working",
  });
};

// Clear Cart
exports.clearCart = async (req, res) => {
  res.json({
    success: true,
    message: "Clear Cart Working",
  });
};