const express = require("express");
const router = express.Router();

const {
  createPage,
  getAllPages,
  getSinglePage,
  updatePage,
  deletePage,
  updatePageOrder,
} = require("../controllers/pageController");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminOnly");

// Public APIs
router.get("/", getAllPages);
router.get("/:slug", getSinglePage);

// Admin APIs
router.post("/", protect, adminOnly, createPage);

// ✅ Put this BEFORE "/:id"
router.put("/order", protect, adminOnly, updatePageOrder);

router.put("/:id", protect, adminOnly, updatePage);

router.delete("/:id", protect, adminOnly, deletePage);

module.exports = router;