// const Seller = require("../../models/seller/Seller");

// exports.getPendingSellers = async (req, res) => {
//   try {
//     const sellers = await Seller.find({
//       status: "Pending",
//     }).select("-password");

//     res.status(200).json({
//       success: true,
//       sellers,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// exports.approveSeller = async (req, res) => {
//   try {
//     const seller = await Seller.findById(req.params.id);

//     if (!seller) {
//       return res.status(404).json({
//         success: false,
//         message: "Seller not found",
//       });
//     }

//     seller.status = "Approved";

//     await seller.save();

//     res.status(200).json({
//       success: true,
//       message: "Seller Approved Successfully",
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// exports.rejectSeller = async (req, res) => {
//   try {
//     const seller = await Seller.findById(req.params.id);

//     if (!seller) {
//       return res.status(404).json({
//         success: false,
//         message: "Seller not found",
//       });
//     }

//     seller.status = "Rejected";

//     await seller.save();

//     res.status(200).json({
//       success: true,
//       message: "Seller Rejected Successfully",
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

const Seller = require("../../models/seller/Seller");

// ======================================================
// GET PENDING SELLERS
// ======================================================

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

// ======================================================
// GET ALL SELLERS
// ======================================================

exports.getAllSellers = async (req, res) => {
  try {
    const sellers = await Seller.find()
      .select("-password")
      .sort({ createdAt: -1 });

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


// ======================================================
// GET SINGLE SELLER
// ======================================================

exports.getSellerById = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id)
      .select("-password");

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    res.status(200).json({
      success: true,
      seller,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================================
// CREATE SELLER
// ======================================================

exports.createSeller = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      storeName,
      address,
      city,
      state,
      pincode,
      gstNumber,
      panNumber,
    } = req.body;

    // Required fields
    if (
      !name ||
      !email ||
      !phone ||
      !password ||
      !storeName ||
      !address ||
      !city ||
      !state ||
      !pincode
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required seller fields",
      });
    }

    // Check duplicate email
    const existingEmail = await Seller.findOne({
      email: email.toLowerCase(),
    });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Seller with this email already exists",
      });
    }

    // Check duplicate phone
    const existingPhone = await Seller.findOne({
      phone,
    });

    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: "Seller with this phone number already exists",
      });
    }

    const seller = new Seller({
      name,
      email: email.toLowerCase(),
      phone,
      password,
      storeName,
      address,
      city,
      state,
      pincode,
      gstNumber,
      panNumber,

      // Seller created directly by admin
      status: "approved",
    });

    await seller.save();

    const sellerResponse = seller.toObject();
    delete sellerResponse.password;

    res.status(201).json({
      success: true,
      message: "Seller created successfully",
      seller: sellerResponse,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================================
// UPDATE SELLER
// ======================================================

exports.updateSeller = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id);

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    const {
      name,
      email,
      phone,
      password,
      storeName,
      address,
      city,
      state,
      pincode,
      gstNumber,
      panNumber,
      status,
    } = req.body;

    // Update only fields that are provided
    if (name !== undefined) seller.name = name;
    if (email !== undefined) seller.email = email.toLowerCase();
    if (phone !== undefined) seller.phone = phone;
    if (storeName !== undefined) seller.storeName = storeName;
    if (address !== undefined) seller.address = address;
    if (city !== undefined) seller.city = city;
    if (state !== undefined) seller.state = state;
    if (pincode !== undefined) seller.pincode = pincode;
    if (gstNumber !== undefined) seller.gstNumber = gstNumber;
    if (panNumber !== undefined) seller.panNumber = panNumber;

    // Only update password if admin sends a new one
    if (password && password.trim() !== "") {
      seller.password = password;
    }

    // Allow status update
    if (
      status &&
      ["pending", "approved", "rejected"].includes(status)
    ) {
      seller.status = status;
    }

    await seller.save();

    const sellerResponse = seller.toObject();
    delete sellerResponse.password;

    res.status(200).json({
      success: true,
      message: "Seller updated successfully",
      seller: sellerResponse,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================================
// DELETE SELLER
// ======================================================

exports.deleteSeller = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id);

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    await Seller.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Seller deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================================
// APPROVE SELLER
// ======================================================

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


// ======================================================
// REJECT SELLER
// ======================================================

exports.rejectSeller = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id);

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: error.message,
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