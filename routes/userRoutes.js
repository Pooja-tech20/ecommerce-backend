// const express = require("express");
// const router = express.Router();

// //const protect  = require("../middleware/authMiddleware");
// const { protect, adminOnly } = require("../middleware/authMiddleware");
// const upload = require("../config/multer");

// const {
//   getProfile,
//   updateProfile,
//   changePassword,
//   uploadProfileImage,
// } = require("../controllers/userController");

// // Get Profile
// router.get("/profile", protect, getProfile);

// // Update Profile
// router.put(
//   "/profile",
//   protect,
//   upload.single("image"),
//   updateProfile
// );


// // Change Password
// router.put(
//   "/change-password",
//   protect,
//   changePassword
// );

// // Upload Image
// router.put(
//   "/profile-image",
//   protect,
//   upload.single("image"),
//   uploadProfileImage
// );

// module.exports = router;

const express = require("express");
const router = express.Router();

const { protect, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../config/multer");

const {
  getProfile,
  updateProfile,
  changePassword,
  uploadProfileImage,
} = require("../controllers/userController");

// Get Profile
router.get("/profile", protect, getProfile);

// Update Profile
router.put(
  "/profile",
  protect,
  upload.single("image"),
  updateProfile
);


// Change Password
router.put(
  "/change-password",
  protect,
  changePassword
);

// Upload Image
router.put(
  "/profile-image",
  protect,
  upload.single("image"),
  uploadProfileImage
);

module.exports = router;