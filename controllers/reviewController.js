// const Review = require("../models/Review");
// const Product = require("../models/Product");

// // ==========================
// // Add Review
// // ==========================
// exports.createReview = async (req, res) => {
//   try {
//     const { productId, rating, comment } = req.body;

//     const product = await Product.findById(productId);

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       });
//     }

//     // Prevent duplicate review
//     const alreadyReviewed = await Review.findOne({
//       user: req.user._id,
//       product: productId,
//     });

//     if (alreadyReviewed) {
//       return res.status(400).json({
//         success: false,
//         message: "You already reviewed this product",
//       });
//     }

//     const review = await Review.create({
//       user: req.user._id,
//       product: productId,
//       rating,
//       comment,
//     });

//     // Update Product Rating
//     const reviews = await Review.find({ product: productId });

//     const avgRating =
//       reviews.reduce((sum, item) => sum + item.rating, 0) /
//       reviews.length;

//     product.rating = avgRating.toFixed(1);

//     await product.save();

//     res.status(201).json({
//       success: true,
//       message: "Review added successfully",
//       review,
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ==========================
// // Get Reviews
// // ==========================
// exports.getReviews = async (req, res) => {
//   try {

//     const reviews = await Review.find({
//       product: req.params.productId,
//     })
//       .populate("user", "fullName image")
//       .sort("-createdAt");

//     res.status(200).json({
//       success: true,
//       count: reviews.length,
//       reviews,
//     });

//   } catch (error) {

//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });

//   }
// };

// // ==========================
// // Update Review
// // ==========================
// exports.updateReview = async (req, res) => {
//   try {

//     const review = await Review.findById(req.params.id);

//     if (!review) {
//       return res.status(404).json({
//         success: false,
//         message: "Review not found",
//       });
//     }

//     if (review.user.toString() !== req.user._id.toString()) {
//       return res.status(403).json({
//         success: false,
//         message: "Unauthorized",
//       });
//     }

//     review.rating = req.body.rating;
//     review.comment = req.body.comment;

//     await review.save();

//     res.status(200).json({
//       success: true,
//       message: "Review updated successfully",
//       review,
//     });

//   } catch (error) {

//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });

//   }
// };

// // ==========================
// // Delete Review
// // ==========================
// exports.deleteReview = async (req, res) => {
//   try {

//     const review = await Review.findById(req.params.id);

//     if (!review) {
//       return res.status(404).json({
//         success: false,
//         message: "Review not found",
//       });
//     }

//     if (review.user.toString() !== req.user._id.toString()) {
//       return res.status(403).json({
//         success: false,
//         message: "Unauthorized",
//       });
//     }

//     await review.deleteOne();

//     res.status(200).json({
//       success: true,
//       message: "Review deleted successfully",
//     });

//   } catch (error) {

//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });

//   }
// };

const Review = require("../models/Review");
const Product = require("../models/Product");
const Order = require("../models/Order");

// ==========================================================
// Helper Function: Update Product Rating
// ==========================================================
const updateProductRating = async (productId) => {
  try {
    const reviews = await Review.find({ product: productId });

    const numReviews = reviews.length;

    const avgRating =
      numReviews === 0
        ? 0
        : reviews.reduce((sum, review) => sum + review.rating, 0) / numReviews;

    await Product.findByIdAndUpdate(productId, {
      rating: Number(avgRating.toFixed(1)),
      numReviews,
      reviews: reviews.map((review) => review._id),
    });

    return { numReviews, avgRating: Number(avgRating.toFixed(1)) };
  } catch (error) {
    console.error("Error updating product rating:", error);
    throw error;
  }
};

// ==========================================================
// Create Review
// POST /api/reviews
// ==========================================================
exports.createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    // Validate product exists
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

    // OPTIONAL: Check if user purchased the product (prevents fake reviews)
    // Uncomment this block if you want to restrict reviews to verified purchasers
    /*
    const hasPurchased = await Order.exists({
      user: req.user._id,
      orderStatus: "delivered",
      "items.product": productId,
    });

    if (!hasPurchased && req.user.role !== "admin") {
      return res.status(400).json({
        success: false,
        message: "You can review only products you have purchased.",
      });
    }
    */

    // Create review
    const review = await Review.create({
      user: req.user._id,
      product: productId,
      rating,
      comment,
      reviewerType: req.user.role === "admin" ? "admin" : "user",
    });

    // Update product rating
    await updateProductRating(productId);

    // Populate user details for response
    const populatedReview = await Review.findById(review._id)
      .populate("user", "fullName image role")
      .populate("product", "name images price");

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      review: populatedReview,
    });
  } catch (error) {
    console.error("Create review error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================================
// Get Reviews for a Product
// GET /api/reviews/product/:productId
// ==========================================================
exports.getReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const reviews = await Review.find({ product: productId })
      .populate("user", "fullName image role")
      .sort("-createdAt");

    // Calculate rating breakdown
    const ratingBreakdown = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    reviews.forEach((review) => {
      if (review.rating >= 1 && review.rating <= 5) {
        ratingBreakdown[review.rating]++;
      }
    });

    res.status(200).json({
      success: true,
      count: reviews.length,
      ratingBreakdown,
      reviews,
    });
  } catch (error) {
    console.error("Get reviews error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================================
// Update Review
// PUT /api/reviews/:id
// ==========================================================
exports.updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const reviewId = req.params.id;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Allow admin to update any review, user can update their own
    if (
      review.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Update fields
    if (rating) review.rating = rating;
    if (comment) review.comment = comment;

    await review.save();

    // Update product rating
    await updateProductRating(review.product);

    // Populate for response
    const updatedReview = await Review.findById(reviewId)
      .populate("user", "fullName image role")
      .populate("product", "name images price");

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      review: updatedReview,
    });
  } catch (error) {
    console.error("Update review error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================================
// Delete Review
// DELETE /api/reviews/:id
// ==========================================================
exports.deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Allow admin to delete any review, user can delete their own
    if (
      review.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const productId = review.product;

    // Delete the review
    await review.deleteOne();

    // Update product rating
    await updateProductRating(productId);

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Delete review error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================================
// Get All Reviews (Admin)
// GET /api/admin/reviews
// ==========================================================
exports.getAllReviews = async (req, res) => {
  try {
    const { 
      productId, 
      rating, 
      sortBy = "createdAt", 
      sortOrder = "desc",
      page = 1,
      limit = 20,
      search
    } = req.query;

    // Build filter
    const filter = {};
    if (productId) filter.product = productId;
    if (rating) filter.rating = Number(rating);

    // Search by comment or user name
    if (search) {
      filter.$or = [
        { comment: { $regex: search, $options: "i" } },
        { reviewerType: { $regex: search, $options: "i" } }
      ];
    }

    // Build sort
    const sortField = sortBy === "rating" ? "rating" : "createdAt";
    const direction = sortOrder === "asc" ? 1 : -1;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const reviews = await Review.find(filter)
      .populate("user", "fullName email image role")
      .populate({
        path: "product",
        select: "name images price sku category",
        populate: { path: "category", select: "name" },
      })
      .sort({ [sortField]: direction })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments(filter);

    // Get review statistics
    const stats = await Review.aggregate([
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          avgRating: { $avg: "$rating" },
          totalRatings: { $sum: 1 },
        },
      },
    ]);

    // Get rating distribution
    const ratingDistribution = await Review.aggregate([
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } },
    ]);

    // Get review type distribution (admin vs user)
    const typeDistribution = await Review.aggregate([
      {
        $group: {
          _id: "$reviewerType",
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit),
      },
      stats: stats[0] || { totalReviews: 0, avgRating: 0 },
      ratingDistribution,
      typeDistribution,
    });
  } catch (error) {
    console.error("Get all reviews error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================================
// Get Review Statistics (Admin Dashboard)
// GET /api/admin/reviews/stats
// ==========================================================
exports.getReviewStats = async (req, res) => {
  try {
    const stats = await Review.aggregate([
      {
        $facet: {
          totalReviews: [{ $count: "count" }],
          avgRating: [{ $group: { _id: null, avg: { $avg: "$rating" } } }],
          ratingDistribution: [
            { $group: { _id: "$rating", count: { $sum: 1 } } },
            { $sort: { _id: -1 } },
          ],
          typeDistribution: [
            { $group: { _id: "$reviewerType", count: { $sum: 1 } } },
          ],
          recentReviews: [
            { $sort: { createdAt: -1 } },
            { $limit: 5 },
            {
              $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user",
              },
            },
            { $unwind: "$user" },
            {
              $lookup: {
                from: "products",
                localField: "product",
                foreignField: "_id",
                as: "product",
              },
            },
            { $unwind: "$product" },
            {
              $project: {
                comment: 1,
                rating: 1,
                createdAt: 1,
                "user.fullName": 1,
                "user.email": 1,
                "product.name": 1,
              },
            },
          ],
        },
      },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalReviews: stats[0].totalReviews[0]?.count || 0,
        avgRating: stats[0].avgRating[0]?.avg || 0,
        ratingDistribution: stats[0].ratingDistribution,
        typeDistribution: stats[0].typeDistribution,
        recentReviews: stats[0].recentReviews,
      },
    });
  } catch (error) {
    console.error("Get review stats error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================================
// Toggle Review Status (Approve/Reject) - Admin
// PUT /api/admin/reviews/:id/toggle-status
// ==========================================================
exports.toggleReviewStatus = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const { status } = req.body; // 'active', 'hidden', 'reported'

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    review.status = status;
    await review.save();

    // If review is hidden, update product rating to exclude it
    if (status === "hidden") {
      // Recalculate rating excluding hidden reviews
      const activeReviews = await Review.find({
        product: review.product,
        status: "active",
      });
      
      const numReviews = activeReviews.length;
      const avgRating =
        numReviews === 0
          ? 0
          : activeReviews.reduce((sum, r) => sum + r.rating, 0) / numReviews;

      await Product.findByIdAndUpdate(review.product, {
        rating: Number(avgRating.toFixed(1)),
        numReviews,
      });
    } else if (status === "active") {
      // Recalculate including this review
      await updateProductRating(review.product);
    }

    res.status(200).json({
      success: true,
      message: `Review ${status === 'active' ? 'approved' : status === 'hidden' ? 'hidden' : 'reported'} successfully`,
      review,
    });
  } catch (error) {
    console.error("Toggle review status error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================================
// Report a Review (User)
// POST /api/reviews/:id/report
// ==========================================================
exports.reportReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const { reason } = req.body;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Check if user already reported this review
    if (review.reportedBy && review.reportedBy.includes(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: "You already reported this review",
      });
    }

    // Add report
    review.reportedBy = review.reportedBy || [];
    review.reportedBy.push(req.user._id);
    review.reportReason = reason || "Inappropriate content";
    review.status = "reported";

    await review.save();

    res.status(200).json({
      success: true,
      message: "Review reported successfully",
    });
  } catch (error) {
    console.error("Report review error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================================
// Get Product Rating Summary
// GET /api/reviews/product/:productId/rating-summary
// ==========================================================
exports.getProductRatingSummary = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId)
      .select("rating numReviews reviews");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Get detailed rating distribution
    const ratingDistribution = await Review.aggregate([
      { $match: { product: productId } },
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } },
    ]);

    // Get recent reviews with user details
    const recentReviews = await Review.find({ product: productId })
      .populate("user", "fullName image")
      .sort({ createdAt: -1 })
      .limit(3);

    res.status(200).json({
      success: true,
      product: {
        id: product._id,
        rating: product.rating,
        numReviews: product.numReviews,
      },
      ratingDistribution,
      recentReviews,
    });
  } catch (error) {
    console.error("Get product rating summary error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};