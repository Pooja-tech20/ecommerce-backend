const Address = require("../models/Address");

// ======================
// Add Address
// ======================

exports.addAddress = async (req, res) => {
  try {

    const {
  fullName,
  phone,
  label,
  fullAddress,
  city,
  state,
  pincode,
  landmark,
  isDefault,
} = req.body;

    if (
    !fullName ||
    !phone ||
    !fullAddress ||
    !city ||
    !state ||
    !pincode
){
      return res.status(400).json({
        success: false,
        message: "All required fields are mandatory",
      });
    }

    if (isDefault) {
      await Address.updateMany(
        { user: req.user._id },
        { isDefault: false }
      );
    }

    const address = await Address.create({
    user: req.user._id,
    fullName,
    phone,
    label,
    fullAddress,
    city,
    state,
    pincode,
    landmark,
    isDefault,
});

    res.status(201).json({
      success: true,
      message: "Address Added Successfully",
      address,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};



// ======================
// Get Addresses
// ======================

exports.getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({
      user: req.user._id,
    }).sort({
      isDefault: -1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: addresses.length,
      addresses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================
// Update Address
// ======================

exports.updateAddress = async (req, res) => {

  try {

    if (req.body.isDefault) {
      await Address.updateMany(
        { user: req.user._id },
        { isDefault: false }
      );
    }

    const address = await Address.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id,
      },
      req.body,
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address Not Found",
      });
    }

    res.json({
      success: true,
      message: "Address Updated",
      address,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};



// ======================
// Delete Address
// ======================

exports.deleteAddress = async (req, res) => {

  try {

    const address = await Address.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address Not Found",
      });
    }

    res.json({
      success: true,
      message: "Address Deleted Successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ======================
// Save Address Automatically
// ======================

exports.saveAddressIfNotExists = async (req, res) => {
  try {
   const {
    fullName,
    phone,
    label,
    fullAddress,
    city,
    state,
    pincode,
    landmark,
} = req.body;

    if (!fullAddress || !city || !state || !pincode) {
      return res.status(400).json({
        success: false,
        message: "Address details are required",
      });
    }

    // Check if same address already exists
    let address = await Address.findOne({
      user: req.user._id,
      fullAddress,
      city,
      state,
      pincode,
    });

    // If already exists, don't create duplicate
    if (address) {
      return res.status(200).json({
        success: true,
        message: "Address already saved",
        address,
      });
    }

    // Check whether user already has an address
    const addressCount = await Address.countDocuments({
      user: req.user._id,
    });

    // First address becomes default
    const isDefault = addressCount === 0;

    address = await Address.create({
      user: req.user._id,
      label: label || "Home",
      fullAddress,
      city,
      state,
      pincode,
      landmark: landmark || "",
      isDefault,
    });

    res.status(201).json({
      success: true,
      message: "Address saved successfully",
      address,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};