const Banner = require("../models/Banner");

// =====================================
// Create Banner (admin only)
// =====================================
exports.createBanner = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const { title, link, status, order } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Banner image is required",
      });
    }

    const banner = await Banner.create({
      title,
      link,
      status: status || "active",
      order: order || 0,
      image: req.file.path,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Banner created successfully",
      banner,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// Get All Banners
// Public — homepage carousel calls this.
// By default only "active" banners are returned, sorted for the carousel.
// Pass ?all=true (as an admin) to see inactive ones too.
// =====================================
exports.getAllBanners = async (req, res) => {
  try {
    const filter = req.query.all === "true"
      ? {}
      : { isActive: true };

    const banners = await Banner.find(filter).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      banners,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
// =====================================
// Get Single Banner By ID
// =====================================
exports.getSingleBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    res.status(200).json({
      success: true,
      banner,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// Update Banner (admin only)
// =====================================
exports.updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    if (req.body.title !== undefined) banner.title = req.body.title;
    if (req.body.link !== undefined) banner.link = req.body.link;
    if (req.body.status !== undefined) banner.status = req.body.status;
    if (req.body.order !== undefined) banner.order = req.body.order;
    if (req.file) banner.image = req.file.path;

    await banner.save();

    res.status(200).json({
      success: true,
      message: "Banner updated successfully",
      banner,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// Delete Banner (admin only)
// =====================================
exports.deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    await banner.deleteOne();

    res.status(200).json({
      success: true,
      message: "Banner deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};