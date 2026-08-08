const Seller = require("../../models/seller/Seller");

exports.getPendingSellers = async (req, res) => {
  try {
    const sellers = await Seller.find({
      status: "Pending",
    }).select("-password");

    res.status(200).json({
      success: true,
      sellers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.approveSeller = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id);

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    seller.status = "Approved";

    await seller.save();

    res.status(200).json({
      success: true,
      message: "Seller Approved Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.rejectSeller = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id);

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    seller.status = "Rejected";

    await seller.save();

    res.status(200).json({
      success: true,
      message: "Seller Rejected Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};