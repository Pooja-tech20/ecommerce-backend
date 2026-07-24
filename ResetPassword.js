// resetPassword.js
// One-off script to fix an account whose password got double-hashed
// by the old changePassword bug. Run this once, then delete the file.
//
// Usage:
//   node resetPassword.js <phone> <newPassword>
//
// Example:
//   node resetPassword.js 2222222222 MyNewPass123

require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const User = require("./models/User");

const phone = process.argv[2];
const newPassword = process.argv[3];

if (!phone || !newPassword) {
  console.error("Usage: node resetPassword.js <phone> <newPassword>");
  process.exit(1);
}

(async () => {
  await connectDB();

  const user = await User.findOne({ phone });
  if (!user) {
    console.error(`No user found with phone: ${phone}`);
    process.exit(1);
  }

  // Assign the PLAIN password — the model's pre("save") hook hashes it
  // exactly once. Do NOT bcrypt.hash() it here, that's what caused the
  // original bug.
  user.password = newPassword;
  await user.save();

  console.log(`Password reset for ${user.fullName} (${user.phone}).`);
  console.log(`They can now log in with the new password: ${newPassword}`);

  await mongoose.connection.close();
  process.exit(0);
})().catch((err) => {
  console.error("Error resetting password:", err);
  process.exit(1);
});
