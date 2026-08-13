// Backward-compatibility shim.
// The real implementation lives in authMiddleware.js.
const { protect } = require("./authMiddleware");

module.exports = protect;