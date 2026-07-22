const express = require("express");
const router = express.Router();

const protect = require("../middleware/protect");
const adminOnly = require("../middleware/adminOnly");
const upload = require("../config/multer");

const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
} = require("../controllers/categoryController");

router.use((req, res, next) => {
  console.log("✅ Category route hit");
  next();
});

router.post("/", upload.single("image"), createCategory);
router.get("/", getCategories);
router.get("/:id", getCategoryById);
router.put("/:id", upload.single("image"), updateCategory);
router.patch(
  "/:id/status",
  protect,
  adminOnly,
  toggleCategoryStatus
);
router.delete("/:id", deleteCategory);

module.exports = router;