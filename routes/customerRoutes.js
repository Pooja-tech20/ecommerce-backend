const express = require("express");
const router = express.Router();

const protect = require("../middleware/protect");
const adminOnly = require("../middleware/adminOnly");

const {
  getAllCustomers,
  getCustomerById,
  deleteCustomer,
} = require("../controllers/customerController");

// Admin only
router.use(protect);
router.use(adminOnly);

router.get("/", getAllCustomers);
router.get("/:id", getCustomerById);
router.delete("/:id", deleteCustomer);

module.exports = router;