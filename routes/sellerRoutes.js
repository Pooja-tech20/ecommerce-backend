const express = require("express");

const router = express.Router();

const {
  registerSeller,
  loginSeller,
  getSellerProfile,
  updateSellerProfile,
  changePassword,
} = require("../controllers/sellerController");

const { sellerAuth } = require("../middleware/sellerAuth");

router.post("/register", registerSeller);

router.post("/login", loginSeller);

router.get("/profile", sellerAuth, getSellerProfile);

router.put("/profile", sellerAuth, updateSellerProfile);

router.put("/change-password", sellerAuth, changePassword);

module.exports = router;