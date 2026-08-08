// const Review = require("../../models/seller/Review");
// const Product = require("../../models/Product");
// const Order = require("../../models/seller/Order");
// const OrderItem = require("../../models/OrderItem");

// // ==========================================================
// // Helper Function: Update Product Rating
// // ==========================================================
// const updateProductRating = async (productId) => {
//   try {
//     const reviews = await Review.find({ 
//       product: productId,
//       status: "approved"
//     });

//     const numReviews = reviews.length;
//     const avgRating = numReviews === 0
//       ? 0
//       : reviews.reduce((sum, review) => sum + review.rating, 0) / numReviews;

//     await Product.findByIdAndUpdate(productId, {
//       rating: Number(avgRating.toFixed(1)),
//       numReviews: numReviews,
//       totalReviews: numReviews,
//     });

//     return { numReviews, avgRating: Number(avgRating.toFixed(1)) };
//   } catch (error) {
//     console.error("Error updating product rating:", error);
//     throw error;
//   }
// };

// // ==========================================================
// // GET ALL REVIEWS FOR SELLER
// // GET /api/seller/reviews
// // ==========================================================
// exports.getReviews = async (req, res) => {
//   try {
//     const sellerId = req.seller._id;
//     const { page = 1, limit = 10, rating, status, search } = req.query;

//     const query = { sellerId };
    
//     if (rating) query.rating = parseInt(rating);
//     if (status) query.status = status;
//     if (search) {
//       query.$or = [
//         { comment: { $regex: search, $options: "i" } },
//       ];
//     }

//     const reviews = await Review.find(query)
//       .populate("user", "fullName email image role")
//       .populate("product", "name images price description")
//       .sort({ createdAt: -1 })
//       .skip((page - 1) * limit)
//       .limit(parseInt(limit));

//     const total = await Review.countDocuments(query);

//     // Rating distribution
//     const distribution = await Review.aggregate([
//       { $match: { sellerId: sellerId } },
//       {
//         $group: {
//           _id: "$rating",
//           count: { $sum: 1 },
//         },
//       },
//       { $sort: { _id: -1 } },
//     ]);

//     // Get review statistics
//     const stats = await Review.aggregate([
//       { $match: { sellerId: sellerId } },
//       {
//         $group: {
//           _id: null,
//           totalReviews: { $sum: 1 },
//           averageRating: { $avg: "$rating" },
//           approved: {
//             $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] },
//           },
//           pending: {
//             $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
//           },
//           reported: {
//             $sum: { $cond: [{ $eq: ["$status", "reported"] }, 1, 0] },
//           },
//           hidden: {
//             $sum: { $cond: [{ $eq: ["$status", "hidden"] }, 1, 0] },
//           },
//           verifiedPurchases: {
//             $sum: { $cond: [{ $eq: ["$verifiedPurchase", true] }, 1, 0] },
//           },
//         },
//       },
//     ]);

//     res.status(200).json({
//       success: true,
//       data: reviews,
//       stats: stats[0] || {
//         totalReviews: 0,
//         averageRating: 0,
//         approved: 0,
//         pending: 0,
//         reported: 0,
//         hidden: 0,
//         verifiedPurchases: 0,
//       },
//       distribution,
//       pagination: {
//         page: parseInt(page),
//         limit: parseInt(limit),
//         total,
//         pages: Math.ceil(total / limit),
//       },
//     });
//   } catch (error) {
//     console.error("Get reviews error:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ==========================================================
// // GET REVIEW STATS
// // GET /api/seller/reviews/stats
// // ==========================================================
// exports.getReviewStats = async (req, res) => {
//   try {
//     const sellerId = req.seller._id;

//     // Overall stats
//     const stats = await Review.aggregate([
//       { $match: { sellerId: sellerId } },
//       {
//         $group: {
//           _id: null,
//           totalReviews: { $sum: 1 },
//           averageRating: { $avg: "$rating" },
//           totalHelpful: { $sum: "$helpfulCount" },
//           approved: {
//             $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] },
//           },
//           pending: {
//             $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
//           },
//           reported: {
//             $sum: { $cond: [{ $eq: ["$status", "reported"] }, 1, 0] },
//           },
//           hidden: {
//             $sum: { $cond: [{ $eq: ["$status", "hidden"] }, 1, 0] },
//           },
//           verifiedPurchases: {
//             $sum: { $cond: [{ $eq: ["$verifiedPurchase", true] }, 1, 0] },
//           },
//         },
//       },
//     ]);

//     // Rating distribution
//     const distribution = await Review.aggregate([
//       { $match: { sellerId: sellerId } },
//       {
//         $group: {
//           _id: "$rating",
//           count: { $sum: 1 },
//         },
//       },
//       { $sort: { _id: -1 } },
//     ]);

//     // Monthly trend (last 6 months)
//     const monthlyTrend = await Review.aggregate([
//       { $match: { sellerId: sellerId } },
//       {
//         $group: {
//           _id: {
//             month: { $month: "$createdAt" },
//             year: { $year: "$createdAt" },
//           },
//           count: { $sum: 1 },
//           avgRating: { $avg: "$rating" },
//         },
//       },
//       { $sort: { "_id.year": -1, "_id.month": -1 } },
//       { $limit: 6 },
//     ]);

//     // Top rated products
//     const topProducts = await Review.aggregate([
//       { $match: { sellerId: sellerId, status: "approved" } },
//       {
//         $group: {
//           _id: "$product",
//           avgRating: { $avg: "$rating" },
//           totalReviews: { $sum: 1 },
//         },
//       },
//       { $sort: { avgRating: -1 } },
//       { $limit: 5 },
//       {
//         $lookup: {
//           from: "products",
//           localField: "_id",
//           foreignField: "_id",
//           as: "product",
//         },
//       },
//       { $unwind: "$product" },
//       {
//         $project: {
//           productName: "$product.name",
//           productImage: { $arrayElemAt: ["$product.images", 0] },
//           avgRating: 1,
//           totalReviews: 1,
//         },
//       },
//     ]);

//     res.status(200).json({
//       success: true,
//       data: {
//         stats: stats[0] || {
//           totalReviews: 0,
//           averageRating: 0,
//           totalHelpful: 0,
//           approved: 0,
//           pending: 0,
//           reported: 0,
//           hidden: 0,
//           verifiedPurchases: 0,
//         },
//         distribution,
//         monthlyTrend,
//         topProducts,
//       },
//     });
//   } catch (error) {
//     console.error("Get review stats error:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ==========================================================
// // GET SINGLE REVIEW
// // GET /api/seller/reviews/:id
// // ==========================================================
// exports.getReview = async (req, res) => {
//   try {
//     const reviewId = req.params.id;
//     const sellerId = req.seller._id;

//     const review = await Review.findOne({
//       _id: reviewId,
//       sellerId: sellerId,
//     })
//       .populate("user", "fullName email image role")
//       .populate("product", "name images price description")
//       .populate("reply.repliedBy", "fullName");

//     if (!review) {
//       return res.status(404).json({
//         success: false,
//         message: "Review not found or you don't have permission",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: review,
//     });
//   } catch (error) {
//     console.error("Get review error:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ==========================================================
// // REPLY TO REVIEW
// // POST /api/seller/reviews/:id/reply
// // ==========================================================
// exports.replyToReview = async (req, res) => {
//   try {
//     const { reply } = req.body;
//     const reviewId = req.params.id;
//     const sellerId = req.seller._id;

//     if (!reply || reply.trim().length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Reply text is required",
//       });
//     }

//     const review = await Review.findOne({
//       _id: reviewId,
//       sellerId: sellerId,
//     });

//     if (!review) {
//       return res.status(404).json({
//         success: false,
//         message: "Review not found or you don't have permission",
//       });
//     }

//     // Update reply
//     review.reply = {
//       text: reply.trim(),
//       repliedAt: new Date(),
//       repliedBy: req.seller._id,
//     };

//     await review.save();

//     // Populate for response
//     const updatedReview = await Review.findById(reviewId)
//       .populate("user", "fullName email image")
//       .populate("product", "name images price")
//       .populate("reply.repliedBy", "fullName");

//     res.status(200).json({
//       success: true,
//       message: "Reply added successfully",
//       data: updatedReview,
//     });
//   } catch (error) {
//     console.error("Reply to review error:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ==========================================================
// // UPDATE REVIEW STATUS
// // PATCH /api/seller/reviews/:id/status
// // ==========================================================
// exports.updateReviewStatus = async (req, res) => {
//   try {
//     const { status, reportReason } = req.body;
//     const reviewId = req.params.id;
//     const sellerId = req.seller._id;

//     if (!status) {
//       return res.status(400).json({
//         success: false,
//         message: "Status is required",
//       });
//     }

//     const validStatuses = ["approved", "pending", "reported", "hidden"];
//     if (!validStatuses.includes(status)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid status. Must be: approved, pending, reported, hidden",
//       });
//     }

//     const review = await Review.findOne({
//       _id: reviewId,
//       sellerId: sellerId,
//     });

//     if (!review) {
//       return res.status(404).json({
//         success: false,
//         message: "Review not found or you don't have permission",
//       });
//     }

//     // Update status
//     review.status = status;
    
//     if (status === "reported" && reportReason) {
//       review.reportReason = reportReason;
//       review.reportedBy = review.reportedBy || [];
//       if (!review.reportedBy.includes(sellerId)) {
//         review.reportedBy.push(sellerId);
//       }
//     }

//     // Update sellerVisibility based on status
//     if (status === "approved") {
//       review.sellerVisibility = "Published";
//     } else if (status === "hidden") {
//       review.sellerVisibility = "Hidden";
//     } else if (status === "reported") {
//       review.sellerVisibility = "Reported";
//     }

//     await review.save();

//     // Update product rating if status changed
//     await updateProductRating(review.product);

//     const updatedReview = await Review.findById(reviewId)
//       .populate("user", "fullName email image")
//       .populate("product", "name images price");

//     res.status(200).json({
//       success: true,
//       message: `Review status updated to ${status}`,
//       data: updatedReview,
//     });
//   } catch (error) {
//     console.error("Update review status error:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ==========================================================
// // GET PRODUCT REVIEW SUMMARY
// // GET /api/seller/reviews/product/:productId/summary
// // ==========================================================
// exports.getProductReviewSummary = async (req, res) => {
//   try {
//     const { productId } = req.params;
//     const sellerId = req.seller._id;

//     const product = await Product.findOne({
//       _id: productId,
//       sellerId: sellerId,
//     });

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found or you don't have permission",
//       });
//     }

//     // Get all approved reviews for this product
//     const reviews = await Review.find({
//       product: productId,
//       status: "approved",
//     });

//     const numReviews = reviews.length;
//     const avgRating = numReviews === 0
//       ? 0
//       : reviews.reduce((sum, review) => sum + review.rating, 0) / numReviews;

//     // Rating distribution
//     const distribution = {
//       5: 0,
//       4: 0,
//       3: 0,
//       2: 0,
//       1: 0,
//     };

//     reviews.forEach((review) => {
//       if (review.rating >= 1 && review.rating <= 5) {
//         distribution[review.rating]++;
//       }
//     });

//     // Recent reviews (last 5)
//     const recentReviews = await Review.find({
//       product: productId,
//       status: "approved",
//     })
//       .populate("user", "fullName image")
//       .sort({ createdAt: -1 })
//       .limit(5);

//     res.status(200).json({
//       success: true,
//       data: {
//         product: {
//           _id: product._id,
//           name: product.name,
//           rating: product.rating || 0,
//           numReviews: product.numReviews || 0,
//         },
//         summary: {
//           totalReviews: numReviews,
//           averageRating: Number(avgRating.toFixed(1)),
//           distribution,
//         },
//         recentReviews,
//       },
//     });
//   } catch (error) {
//     console.error("Get product review summary error:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ==========================================================
// // DELETE REVIEW (Seller)
// // DELETE /api/seller/reviews/:id
// // ==========================================================
// exports.deleteReview = async (req, res) => {
//   try {
//     const reviewId = req.params.id;
//     const sellerId = req.seller._id;

//     const review = await Review.findOne({
//       _id: reviewId,
//       sellerId: sellerId,
//     });

//     if (!review) {
//       return res.status(404).json({
//         success: false,
//         message: "Review not found or you don't have permission",
//       });
//     }

//     const productId = review.product;

//     // Delete the review
//     await review.deleteOne();

//     // Update product rating
//     await updateProductRating(productId);

//     res.status(200).json({
//       success: true,
//       message: "Review deleted successfully",
//     });
//   } catch (error) {
//     console.error("Delete review error:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ==========================================================
// // MARK REVIEW AS HELPFUL (User)
// // POST /api/seller/reviews/:id/helpful
// // ==========================================================
// exports.markHelpful = async (req, res) => {
//   try {
//     const reviewId = req.params.id;
//     const userId = req.user._id;

//     const review = await Review.findById(reviewId);

//     if (!review) {
//       return res.status(404).json({
//         success: false,
//         message: "Review not found",
//       });
//     }

//     // Check if user already marked as helpful
//     if (review.helpfulUsers && review.helpfulUsers.includes(userId)) {
//       return res.status(400).json({
//         success: false,
//         message: "You already marked this review as helpful",
//       });
//     }

//     // Add helpful
//     review.helpfulCount = (review.helpfulCount || 0) + 1;
//     review.helpfulUsers = review.helpfulUsers || [];
//     review.helpfulUsers.push(userId);

//     await review.save();

//     res.status(200).json({
//       success: true,
//       message: "Review marked as helpful",
//       data: {
//         helpfulCount: review.helpfulCount,
//       },
//     });
//   } catch (error) {
//     console.error("Mark helpful error:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// ✅ FIXED: Correct path to models
const SellerReview = require("../../models/seller/Review");
const Product = require("../../models/seller/Product");
const Order = require("../../models/seller/Order");
const OrderItem = require("../../models/OrderItem");

// ==========================================================
// Helper Function: Update Product Rating
// ==========================================================
const updateProductRating = async (productId) => {
  try {
    const reviews = await SellerReview.find({ 
      product: productId,
      status: "approved"
    });

    const numReviews = reviews.length;
    const avgRating = numReviews === 0
      ? 0
      : reviews.reduce((sum, review) => sum + review.rating, 0) / numReviews;

    await Product.findByIdAndUpdate(productId, {
      rating: Number(avgRating.toFixed(1)),
      numReviews: numReviews,
      totalReviews: numReviews,
    });

    return { numReviews, avgRating: Number(avgRating.toFixed(1)) };
  } catch (error) {
    console.error("Error updating product rating:", error);
    throw error;
  }
};

// ==========================================================
// GET ALL REVIEWS FOR SELLER
// GET /api/seller/reviews
// ==========================================================
exports.getReviews = async (req, res) => {
  try {
    const sellerId = req.seller._id;
    const { page = 1, limit = 10, rating, status, search } = req.query;

    const query = { sellerId: sellerId };
    
    if (rating) query.rating = parseInt(rating);
    if (status) query.status = status;
    if (search) {
      query.comment = { $regex: search, $options: "i" };
    }

    console.log("🔍 Query:", JSON.stringify(query, null, 2));

    const total = await SellerReview.countDocuments(query);
    console.log("📊 Total reviews:", total);

    const reviews = await SellerReview.find(query)
      .populate("user", "fullName email image role")
      .populate("product", "name images price description")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    console.log("📝 Reviews found:", reviews.length);

    const distribution = await SellerReview.aggregate([
      { $match: { sellerId: sellerId } },
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } },
    ]);

    const stats = await SellerReview.aggregate([
      { $match: { sellerId: sellerId } },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          averageRating: { $avg: "$rating" },
          approved: {
            $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] },
          },
          pending: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
          },
          reported: {
            $sum: { $cond: [{ $eq: ["$status", "reported"] }, 1, 0] },
          },
          hidden: {
            $sum: { $cond: [{ $eq: ["$status", "hidden"] }, 1, 0] },
          },
          verifiedPurchases: {
            $sum: { $cond: [{ $eq: ["$verifiedPurchase", true] }, 1, 0] },
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: reviews,
      stats: stats[0] || {
        totalReviews: 0,
        averageRating: 0,
        approved: 0,
        pending: 0,
        reported: 0,
        hidden: 0,
        verifiedPurchases: 0,
      },
      distribution,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
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
// GET REVIEW STATS
// GET /api/seller/reviews/stats
// ==========================================================
exports.getReviewStats = async (req, res) => {
  try {
    const sellerId = req.seller._id;

    const stats = await SellerReview.aggregate([
      { $match: { sellerId: sellerId } },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          averageRating: { $avg: "$rating" },
          totalHelpful: { $sum: "$helpfulCount" },
          approved: {
            $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] },
          },
          pending: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
          },
          reported: {
            $sum: { $cond: [{ $eq: ["$status", "reported"] }, 1, 0] },
          },
          hidden: {
            $sum: { $cond: [{ $eq: ["$status", "hidden"] }, 1, 0] },
          },
          verifiedPurchases: {
            $sum: { $cond: [{ $eq: ["$verifiedPurchase", true] }, 1, 0] },
          },
        },
      },
    ]);

    const distribution = await SellerReview.aggregate([
      { $match: { sellerId: sellerId } },
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } },
    ]);

    const monthlyTrend = await SellerReview.aggregate([
      { $match: { sellerId: sellerId } },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          count: { $sum: 1 },
          avgRating: { $avg: "$rating" },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 6 },
    ]);

    const topProducts = await SellerReview.aggregate([
      { $match: { sellerId: sellerId, status: "approved" } },
      {
        $group: {
          _id: "$product",
          avgRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
      { $sort: { avgRating: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $project: {
          productName: "$product.name",
          productImage: { $arrayElemAt: ["$product.images", 0] },
          avgRating: 1,
          totalReviews: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        stats: stats[0] || {
          totalReviews: 0,
          averageRating: 0,
          totalHelpful: 0,
          approved: 0,
          pending: 0,
          reported: 0,
          hidden: 0,
          verifiedPurchases: 0,
        },
        distribution,
        monthlyTrend,
        topProducts,
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
// GET SINGLE REVIEW
// GET /api/seller/reviews/:id
// ==========================================================
// ==========================================================
// GET SINGLE REVIEW
// GET /api/seller/reviews/:id
// ==========================================================
exports.getReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const sellerId = req.seller._id;

    const review = await SellerReview.findById(reviewId)
      .populate("user", "fullName email image role")
      .populate("product", "name images price description sellerId");

    // Review does not exist
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Product does not exist
    if (!review.product) {
      return res.status(404).json({
        success: false,
        message: "Product associated with this review was not found",
      });
    }

    // Check seller ownership through product
    if (
      !review.product.sellerId ||
      review.product.sellerId.toString() !== sellerId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to view this review",
      });
    }

    return res.status(200).json({
      success: true,
      data: review,
    });

  } catch (error) {
    console.error("Get review error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ==========================================================
// REPLY TO REVIEW
// POST /api/seller/reviews/:id/reply
// ==========================================================
// exports.replyToReview = async (req, res) => {
//   try {
//     const { reply } = req.body;
//     const reviewId = req.params.id;
//     const sellerId = req.seller._id;

//     if (!reply || reply.trim().length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Reply text is required",
//       });
//     }

//     const review = await SellerReview.findOne({
//       _id: reviewId,
//       sellerId: sellerId,
//     });

//     if (!review) {
//       return res.status(404).json({
//         success: false,
//         message: "Review not found or you don't have permission",
//       });
//     }

//     // review.reply = {
//     //   text: reply.trim(),
//     //   repliedAt: new Date(),
//     //   repliedBy: req.seller._id,
//     // };
//     review.sellerReply = reply.trim();
//     review.sellerReplyAt = new Date();

//     await review.save();

//     const updatedReview = await SellerReview.findById(reviewId)
//       .populate("user", "fullName email image")
//       .populate("product", "name images price")
//       .populate("reply.repliedBy", "fullName");

//     res.status(200).json({
//       success: true,
//       message: "Reply added successfully",
//       data: updatedReview,
//     });
//   } catch (error) {
//     console.error("Reply to review error:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
// ==========================================================
// REPLY TO REVIEW
// POST /api/seller/reviews/:id/reply
// ==========================================================
exports.replyToReview = async (req, res) => {
  try {
    const { reply } = req.body;
    const reviewId = req.params.id;
    const sellerId = req.seller._id;

    // Validate reply
    if (!reply || reply.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Reply text is required",
      });
    }

    // Find review and product
    const review = await SellerReview.findById(reviewId)
      .populate(
        "product",
        "name images price description sellerId"
      );

    // Review not found
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Product not found
    if (!review.product) {
      return res.status(404).json({
        success: false,
        message: "Product not found for this review",
      });
    }

    // Check seller owns the product
    if (
      !review.product.sellerId ||
      review.product.sellerId.toString() !== sellerId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to reply to this review",
      });
    }

    // Save seller reply
    review.sellerReply = reply.trim();
    review.sellerReplyAt = new Date();

    await review.save();

    // Get updated review
    const updatedReview = await SellerReview.findById(reviewId)
      .populate("user", "fullName email image role")
      .populate(
        "product",
        "name images price description sellerId"
      );

    return res.status(200).json({
      success: true,
      message: "Reply added successfully",
      data: updatedReview,
    });

  } catch (error) {
    console.error("Reply to review error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ==========================================================
// UPDATE REVIEW STATUS
// PATCH /api/seller/reviews/:id/status
// ==========================================================
exports.updateReviewStatus = async (req, res) => {
  try {
    const { status, reportReason } = req.body;
    const reviewId = req.params.id;
    const sellerId = req.seller._id;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const validStatuses = ["approved", "pending", "reported", "hidden"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be: approved, pending, reported, hidden",
      });
    }

    const review = await SellerReview.findOne({
      _id: reviewId,
      sellerId: sellerId,
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found or you don't have permission",
      });
    }

    review.status = status;
    
    if (status === "reported" && reportReason) {
      review.reportReason = reportReason;
      review.reportedBy = review.reportedBy || [];
      if (!review.reportedBy.includes(sellerId)) {
        review.reportedBy.push(sellerId);
      }
    }

    if (status === "approved") {
      review.sellerVisibility = "Published";
    } else if (status === "hidden") {
      review.sellerVisibility = "Hidden";
    } else if (status === "reported") {
      review.sellerVisibility = "Reported";
    }

    await review.save();
    await updateProductRating(review.product);

    const updatedReview = await SellerReview.findById(reviewId)
      .populate("user", "fullName email image")
      .populate("product", "name images price");

    res.status(200).json({
      success: true,
      message: `Review status updated to ${status}`,
      data: updatedReview,
    });
  } catch (error) {
    console.error("Update review status error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================================
// GET PRODUCT REVIEW SUMMARY
// GET /api/seller/reviews/product/:productId/summary
// ==========================================================
exports.getProductReviewSummary = async (req, res) => {
  try {
    const { productId } = req.params;
    const sellerId = req.seller._id;

    const product = await Product.findOne({
      _id: productId,
      sellerId: sellerId,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or you don't have permission",
      });
    }

    const reviews = await SellerReview.find({
      product: productId,
      status: "approved",
    });

    const numReviews = reviews.length;
    const avgRating = numReviews === 0
      ? 0
      : reviews.reduce((sum, review) => sum + review.rating, 0) / numReviews;

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((review) => {
      if (review.rating >= 1 && review.rating <= 5) {
        distribution[review.rating]++;
      }
    });

    const recentReviews = await SellerReview.find({
      product: productId,
      status: "approved",
    })
      .populate("user", "fullName image")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        product: {
          _id: product._id,
          name: product.name,
          rating: product.rating || 0,
          numReviews: product.numReviews || 0,
        },
        summary: {
          totalReviews: numReviews,
          averageRating: Number(avgRating.toFixed(1)),
          distribution,
        },
        recentReviews,
      },
    });
  } catch (error) {
    console.error("Get product review summary error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================================
// DELETE REVIEW
// DELETE /api/seller/reviews/:id
// ==========================================================
exports.deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const sellerId = req.seller._id;

    const review = await SellerReview.findOne({
      _id: reviewId,
      sellerId: sellerId,
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found or you don't have permission",
      });
    }

    const productId = review.product;
    await review.deleteOne();
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
// MARK REVIEW AS HELPFUL
// POST /api/seller/reviews/:id/helpful
// ==========================================================
exports.markHelpful = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const userId = req.user._id;

    const review = await SellerReview.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (review.helpfulUsers && review.helpfulUsers.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: "You already marked this review as helpful",
      });
    }

    review.helpfulCount = (review.helpfulCount || 0) + 1;
    review.helpfulUsers = review.helpfulUsers || [];
    review.helpfulUsers.push(userId);

    await review.save();

    res.status(200).json({
      
      success: true,
      message: "Review marked as helpful",
      data: {
        helpfulCount: review.helpfulCount,
      },
    });
  } catch (error) {
    console.error("Mark helpful error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};