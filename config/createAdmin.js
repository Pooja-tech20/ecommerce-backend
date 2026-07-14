const User = require("../models/User");

const createAdmin = async () => {
  try {
    const admin = await User.findOne({
      username: "admin",
      role: "admin",
    });

    if (admin) {
      console.log("✅ Admin already exists");
      return;
    }

    await User.create({
      fullName: "Admin",
      username: "admin",
      password: "admin@123",
      role: "admin",
    });

    console.log("✅ Default Admin Created");
    console.log("Username : admin");
    console.log("Password : admin@123");
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = createAdmin;