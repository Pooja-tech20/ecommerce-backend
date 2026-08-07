const Review = require("../../models/Review");
const Product = require("../../models/Product");

// ⭐ Get All Reviews
exports.getReviews = async (req, res) => {
  try {
    const sellerId = req.seller._id;
    const { page = 1, limit = 10, rating, status } = req.query;

    const query = { sellerId };
    if (rating) query.rating = parseInt(rating);
    if (status) query.status = status;

    const reviews = await Review.find(query)
      .populate("productId", "name images")
      .populate("customerId", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Review.countDocuments(query);

    // Rating distribution
    const distribution = await Review.aggregate([
      { $match: { sellerId: sellerId } },
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: reviews,
      distribution,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 📊 Review Stats
exports.getReviewStats = async (req, res) => {
  try {
    const sellerId = req.seller._id;

    const stats = await Review.aggregate([
      { $match: { sellerId: sellerId } },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          averageRating: { $avg: "$rating" },
          totalHelpful: { $sum: "$helpful" },
          reported: {
            $sum: { $cond: [{ $eq: ["$isReported", true] }, 1, 0] },
          },
          hidden: {
            $sum: { $cond: [{ $eq: ["$status", "Hidden"] }, 1, 0] },
          },
        },
      },
    ]);

    // Rating distribution
    const distribution = await Review.aggregate([
      { $match: { sellerId: sellerId } },
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        stats: stats[0] || { totalReviews: 0, averageRating: 0 },
        distribution,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 💬 Reply to Review
exports.replyToReview = async (req, res) => {
  try {
    const { reply } = req.body;
    
    const review = await Review.findOne({
      _id: req.params.id,
      sellerId: req.seller._id,
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    review.reply = {
      text: reply,
      repliedAt: new Date(),
    };
    await review.save();

    res.status(200).json({
      success: true,
      message: "Reply added successfully",
      data: review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 🚫 Hide/Report Review
exports.updateReviewStatus = async (req, res) => {
  try {
    const { status, reportReason } = req.body;
    
    const review = await Review.findOne({
      _id: req.params.id,
      sellerId: req.seller._id,
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (status) {
      review.status = status;
    }
    if (reportReason) {
      review.isReported = true;
      review.reportReason = reportReason;
    }
    await review.save();

    res.status(200).json({
      success: true,
      message: "Review status updated",
      data: review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};