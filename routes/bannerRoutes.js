// const express = require("express");
// const router = express.Router();
// const upload = require("../config/multer");

// const {
//   createBanner,
//   getAllBanners,
//   getSingleBanner,
//   updateBanner,
//   deleteBanner,
// } = require("../controllers/bannerController");

// const protect = require("../middleware/authMiddleware");
// const adminOnly = require("../middleware/adminOnly");

// // Public APIs (homepage carousel)
// router.get("/", getAllBanners);
// router.get("/:id", getSingleBanner);

// // Admin only APIs
// router.post("/", protect, adminOnly, upload.single("image"), createBanner);
// router.put("/:id", protect, adminOnly, upload.single("image"), updateBanner);
// router.delete("/:id", protect, adminOnly, deleteBanner);

// module.exports = router;

const express = require("express");
const router = express.Router();
const upload = require("../config/multer");

const {
  createBanner,
  getAllBanners,
  getSingleBanner,
  updateBanner,
  deleteBanner,
} = require("../controllers/bannerController");

const { protect } = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminOnly");

// Public APIs (homepage carousel)
router.get("/", getAllBanners);
router.get("/:id", getSingleBanner);

// Admin only APIs
router.post("/", protect, adminOnly, upload.single("image"), createBanner);
router.put("/:id", protect, adminOnly, upload.single("image"), updateBanner);
router.delete("/:id", protect, adminOnly, deleteBanner);

module.exports = router;