// const express = require("express");
// const router = express.Router();

// const {
//   createUser,
//   adminLogin,
//   changePassword,
//   getAdminProfile,
// } = require("../controllers/adminController");

// router.post("/login", adminLogin);
// router.post("/users", createUser);
// router.get("/profile", auth, getAdminProfile);
// router.put("/change-password", auth, changePassword);

// module.exports = router;

const express = require("express");
const router = express.Router();

const {
  createUser,
  adminLogin,
  changePassword,
  getAdminProfile,
} = require("../controllers/adminController");

const auth = require("../middleware/protect"); // JWT middleware

router.post("/login", adminLogin);
router.post("/users", createUser);

router.get("/profile", auth, getAdminProfile);
router.put("/change-password", auth, changePassword);

module.exports = router;