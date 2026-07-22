const express = require("express");

const router = express.Router();

const upload = require("../middleware/upload");

const {
  createBanner,
  getBanner,
  getAllBanners,
  updateBanner,
  deleteBanner,
} = require("../controllers/bannerController");

const protect = require("../middleware/protect");
const admin = require("../middleware/adminOnly");

// Customer
router.get("/", getBanner);


// Admin
router.get("/all", protect, admin, getAllBanners);


router.post(
  "/",
  protect,
  admin,
  upload.single("image"),
  createBanner
);

router.put(
  "/:id",
  protect,
  admin,
  upload.single("image"),
  updateBanner
);

router.delete(
  "/:id",
  protect,
  admin,
  deleteBanner
);

module.exports = router;