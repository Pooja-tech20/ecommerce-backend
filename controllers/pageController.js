const Page = require("../models/Page");

// ==========================
// Create Page
// ==========================
exports.createPage = async (req, res) => {
  
  try {

    console.log("Body:", req.body);
    const { title, slug, content, status } = req.body;

    console.log(title);
    console.log(slug);

    const page = await Page.create({
      title,
      slug,
      content,
      status,
      createdBy: req.user._id,
    });
     console.log(page);
    res.status(201).json({
      success: true,
      message: "Page created successfully",
      page,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Get All Pages
// ==========================
exports.getAllPages = async (req, res) => {
  try {
    const pages = await Page.find()
    .populate("createdBy", "fullName email")
    .populate("updatedBy", "fullName email")
    .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: pages.length,
      pages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Get Single Page
// ==========================
exports.getSinglePage = async (req, res) => {
  try {
    const page = await Page.findOne({
      slug: req.params.slug,
    })
    .populate("createdBy", "fullName email")
    .populate("updatedBy", "fullName email");

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Page not found",
      });
    }

    res.status(200).json({
      success: true,
      page,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Update Page
// ==========================
exports.updatePage = async (req, res) => {
  try {
    const { title, slug, content, status } = req.body;

    const page = await Page.findById(req.params.id);

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Page not found",
      });
    }

    page.title = title;
    page.slug = slug;
    page.content = content;
    page.status = status;

    // Admin who updated the page
    page.updatedBy = req.user._id;

    await page.save();

    res.status(200).json({
      success: true,
      message: "Page updated successfully",
      page,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Delete Page
// ==========================
exports.deletePage = async (req, res) => {
  try {
    const page = await Page.findByIdAndDelete(req.params.id);

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Page not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Page deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};