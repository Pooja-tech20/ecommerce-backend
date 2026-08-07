// const express = require("express");

// const router = express.Router();

// const protect = require("../middleware/protect");

// const {
//   addAddress,
//   getAddresses,
//   updateAddress,
//   deleteAddress,
// } = require("../controllers/addressController");


// router.post("/", protect, addAddress);

// router.get("/", protect, getAddresses);

// router.put("/:id", protect, updateAddress);

// router.delete("/:id", protect, deleteAddress);

// module.exports = router;

const express = require("express");

const router = express.Router();

const protect = require("../middleware/protect");

const {
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
  saveAddressIfNotExists,
} = require("../controllers/addressController");


router.post("/", protect, addAddress);

// Auto-save the address a customer enters at checkout so it's available as a
// saved address (and pre-fillable) on their next order. Skips creating a
// duplicate if the exact same address already exists for this user.
router.post("/auto-save", protect, saveAddressIfNotExists);

router.get("/", protect, getAddresses);

router.put("/:id", protect, updateAddress);

router.delete("/:id", protect, deleteAddress);

module.exports = router;
