// Backward-compatibility shim.
// The real implementation lives in authMiddleware.js.
const { adminOnly } = require("./authMiddleware");

module.exports = adminOnly;