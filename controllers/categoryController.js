const Category = require("../models/Category");

// ======================
// Create Category
// ======================
exports.createCategory = async (req, res) => {
  try {

    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const { name, description } = req.body || {};

    if (!name) {
      return res.status(400).json({
        success:false,
        message:"Category name is required"
      });
    }
    

    const category = await Category.create({
      name,
      description,
      image: req.file ? req.file.path : null
    });

    res.status(201).json({
      success:true,
      message:"Category created successfully",
      category
    });

  } catch(error) {

    console.log(error);

    res.status(500).json({
      success:false,
      message:error.message
    });

  }
};
// ======================
// Get All Categories
// ======================
exports.getCategories = async (req, res) => {
  try {

    const categories = await Category.find();

    res.status(200).json({
      success: true,
      categories
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};
// ======================
// Get Category By ID
// ======================
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      category,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================
// Update Category
// ======================
exports.updateCategory = async (req, res) => {
  try {
    const updateData = {
      name: req.body.name,
      description: req.body.description,
    };

    // Update image only if a new one is uploaded
    if (req.file) {
      updateData.image = req.file.path;
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================
// Delete Category
// ======================
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};