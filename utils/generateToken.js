// utils/generateToken.js
const jwt = require("jsonwebtoken");

// Accept a user document and sign a token that includes id and role
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};


module.exports = generateToken;
