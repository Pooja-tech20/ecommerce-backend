const Review = require("../models/Review");
const Product = require("../models/Product");

// ==========================
// Add Review
// ==========================
exports.createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Prevent duplicate review
    const alreadyReviewed = await Review.findOne({
      user: req.user._id,
      product: productId,
    });

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "You already reviewed this product",
      });
    }

    const review = await Review.create({
      user: req.user._id,
      product: productId,
      rating,
      comment,
    });

    // Update Product Rating
    const reviews = await Review.find({ product: productId });

    const avgRating =
      reviews.reduce((sum, item) => sum + item.rating, 0) /
      reviews.length;

    product.rating = avgRating.toFixed(1);

    await product.save();

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      review,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Get Reviews
// ==========================
exports.getReviews = async (req, res) => {
  try {

    const reviews = await Review.find({
      product: req.params.productId,
    })
      .populate("user", "fullName image")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ==========================
// Update Review
// ==========================
exports.updateReview = async (req, res) => {
  try {

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    review.rating = req.body.rating;
    review.comment = req.body.comment;

    await review.save();

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      review,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ==========================
// Delete Review
// ==========================
exports.deleteReview = async (req, res) => {
  try {

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await review.deleteOne();

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};