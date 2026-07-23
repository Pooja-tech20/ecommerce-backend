

const Address = require("../models/Address");


// ======================
// Add Address
// ======================

exports.addAddress = async (req, res) => {
  try {

    const {
      label,
      fullAddress,
      city,
      state,
      pincode,
      landmark,
      isDefault,
    } = req.body;

    if (
      !fullAddress ||
      !city ||
      !state ||
      !pincode
    ) {
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