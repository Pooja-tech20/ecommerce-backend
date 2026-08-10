const SellerReview = require("../../models/seller/Review");
const Seller = require("../../models/seller/Seller");
const Order = require("../../models/seller/Order");

// ==========================================
// ADD SELLER REVIEW
// ==========================================
exports.addSellerReview = async (req, res) => {
  try {
    const { seller, order, rating, comment } = req.body;

    if (!seller || !order || !rating) {
      return res.status(400).json({
        success: false,
        message: "Seller, order and rating are required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    // Check seller
    const sellerExists = await Seller.findById(seller);

    if (!sellerExists) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    // Check order
    const orderExists = await Order.findById(order);

    if (!orderExists) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check duplicate review
    const existingReview = await SellerReview.findOne({
      seller,
      customer: req.user._id,
      order,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this seller for this order",
      });
    }

    const review = await SellerReview.create({
      seller,
      customer: req.user._id,
      order,
      rating,
      comment,
    });

    res.status(201).json({
      success: true,
      message: "Seller review submitted successfully",
      review,
    });
  } catch (error) {
    console.error("Add Seller Review Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add seller review",
      error: error.message,
    });
  }
};

// ==========================================
// GET SELLER REVIEWS
// ==========================================
exports.getSellerReviews = async (req, res) => {
  try {
    const { sellerId } = req.params;

    const reviews = await SellerReview.find({
      seller: sellerId,
      status: "approved",
    })
      .populate("customer", "fullName")
      .sort({ createdAt: -1 });

    // Calculate average rating
    const result = await SellerReview.aggregate([
      {
        $match: {
          seller: new require("mongoose").Types.ObjectId(sellerId),
          status: "approved",
        },
      },
      {
        $group: {
          _id: "$seller",
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      reviews,
      summary: {
        averageRating:
          result.length > 0
            ? Number(result[0].averageRating.toFixed(1))
            : 0,
        totalReviews:
          result.length > 0
            ? result[0].totalReviews
            : 0,
      },
    });
  } catch (error) {
    console.error("Get Seller Reviews Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch seller reviews",
      error: error.message,
    });
  }
};

// ==========================================
// ADMIN - GET ALL REVIEWS
// ==========================================
exports.getAllSellerReviews = async (req, res) => {
  try {
    const reviews = await SellerReview.find()
      .populate("seller", "shopName email")
      .populate("customer", "fullName email")
      .populate("order")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch seller reviews",
      error: error.message,
    });
  }
};

// ==========================================
// ADMIN - UPDATE REVIEW STATUS
// ==========================================
exports.updateReviewStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const review = await SellerReview.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `Review ${status} successfully`,
      review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update review",
      error: error.message,
    });
  }
};

// ==========================================
// DELETE REVIEW
// ==========================================
exports.deleteSellerReview = async (req, res) => {
  try {
    const review = await SellerReview.findByIdAndDelete(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Seller review deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete review",
      error: error.message,
    });
  }
};

// ==========================================
// SELLER - REPLY TO REVIEW
// ==========================================
exports.replyToReview = async (req, res) => {
  try {
    const { reply } = req.body;

    if (!reply) {
      return res.status(400).json({
        success: false,
        message: "Reply is required",
      });
    }

    const review = await SellerReview.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Make sure logged-in seller owns this review
    // NOTE: this route uses the `sellerAuth` middleware (not `protect`),
    // which authenticates against the Seller model and sets req.seller —
    // not req.user.
    if (review.seller.toString() !== req.seller._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to reply to this review",
      });
    }

    review.sellerReply = reply;
    review.repliedAt = new Date();

    await review.save();

    res.status(200).json({
      success: true,
      message: "Reply added successfully",
      review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to reply to review",
      error: error.message,
    });
  }
};