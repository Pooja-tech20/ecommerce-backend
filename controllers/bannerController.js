const Banner = require("../models/Banner");


// ===================================
// Create Banner
// ===================================
exports.createBanner = async (req, res) => {
  try {

    const {
      title,
      subtitle,
      buttonText,
      buttonLink,
      isActive,
    } = req.body;

    const banner = await Banner.create({
      title,
      subtitle,
      buttonText,
      buttonLink,
      image: req.file ? req.file.path : "",
      isActive,
    });

    res.status(201).json({
      success: true,
      message: "Banner created successfully",
      banner,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


// ===================================
// Get Active Banner
// ===================================
exports.getBanner = async (req, res) => {

  try {

    const banner = await Banner.findOne({
      isActive: true,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      banner,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};


// ===================================
// Get All Banners (Admin)
// ===================================
exports.getAllBanners = async (req, res) => {

  try {

    const banners = await Banner.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: banners.length,
      banners,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};


// ===================================
// Update Banner
// ===================================
exports.updateBanner = async (req, res) => {

  try {

    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    banner.title = req.body.title || banner.title;
    banner.subtitle = req.body.subtitle || banner.subtitle;
    banner.buttonText = req.body.buttonText || banner.buttonText;
    banner.buttonLink = req.body.buttonLink || banner.buttonLink;

    if (req.body.isActive !== undefined) {
      banner.isActive = req.body.isActive;
    }

    if (req.file) {
      banner.image = req.file.path;
    }

    await banner.save();

    res.status(200).json({
      success: true,
      message: "Banner updated successfully",
      banner,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};


// ===================================
// Delete Banner
// ===================================
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

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};