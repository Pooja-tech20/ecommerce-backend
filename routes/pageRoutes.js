
const express = require("express");
const router = express.Router();

const {
  createPage,
  getAllPages,
  getSinglePage,
  updatePage,
  deletePage,
} = require("../controllers/pageController");

const protect = require("../middleware/authMiddleware"); // <-- import your middleware
const adminOnly =require("../middleware/adminOnly");
// Public APIs (everyone can view)
router.get("/", getAllPages);
router.get("/:slug", getSinglePage);

// Admin only APIs
router.post("/", (req, res, next) => {
  console.log("POST /api/pages HIT");
  next();
}, protect, adminOnly, createPage);
router.put("/:id", protect, adminOnly, updatePage);
router.delete("/:id", protect, adminOnly, deletePage);

module.exports = router;