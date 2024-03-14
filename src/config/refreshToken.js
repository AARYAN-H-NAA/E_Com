const jwt = require("jsonwebtoken");

const generateRefreshToken = (id) => {
  console.log(id);
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "3d" });
};

module.exports = { generateRefreshToken };