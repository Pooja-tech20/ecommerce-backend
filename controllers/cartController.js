const Cart = require("../models/Cart");
const Product = require("../models/Product");

// =======================
// Add To Cart
// =======================

exports.addToCart = async (req, res) => {
  try {

    const { productId, quantity } = req.body;

    const userId = req.user._id;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [],
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
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

    // Save Cart
    await cart.save();

    // Populate Product Details
    await cart.populate("items.product");

    res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// =======================
// Get Cart
// =======================

exports.getCart = async (req, res) => {

  try {

    const cart = await Cart.findOne({
      user: req.user._id,
    }).populate("items.product");

    res.status(200).json({
      success: true,
      cart,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// =======================
// Update Quantity
// =======================

exports.updateCart = async (req, res) => {

  try {

    const { quantity } = req.body;

    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (i) => i.product.toString() === req.params.productId
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Product not in cart",
      });
    }

    item.quantity = Number(quantity);

    if (item.quantity <= 0) {
      cart.items = cart.items.filter(
        (i) => i.product.toString() !== req.params.productId
      );
    }

    await cart.save();

    await cart.populate("items.product");

    res.status(200).json({
      success: true,
      message: "Quantity updated",
      cart,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// =======================
// Remove Product
// =======================

exports.removeCartItem = async (req, res) => {

  try {

    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== req.params.productId
    );

    await cart.save();

    await cart.populate("items.product");

    res.status(200).json({
      success: true,
      message: "Item removed",
      cart,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// =======================
// Clear Cart
// =======================

exports.clearCart = async (req, res) => {

  try {

    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (cart) {
      cart.items = [];

      await cart.save();

      await cart.populate("items.product");
    }

    res.status(200).json({
      success: true,
      message: "Cart cleared",
      cart,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};