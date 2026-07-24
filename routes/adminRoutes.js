const express = require("express");
const router = express.Router();

const {
  createUser,
  adminLogin,
} = require("../controllers/adminController");

router.post("/login", adminLogin);
router.post("/users", createUser);

module.exports = router;