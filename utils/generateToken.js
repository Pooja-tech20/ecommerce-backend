const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  console.log("JWT_SECRET:", process.env.JWT_SECRET);
  console.log("JWT_EXPIRES_IN:", process.env.JWT_EXPIRES_IN);

  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    
  );
};

module.exports = generateToken;