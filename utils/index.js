const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function Response(statusCode, message, data = null) {
  return { statusCode, message, data };
}

async function hash(value) {
  return await bcrypt.hash(value, 12);
}

async function verifyHash(plain, hashed) {
  return await bcrypt.compare(plain, hashed);
}

function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "5d" });
}

function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = {
  Response,
  hash,
  verifyHash,
  generateToken,
  verifyToken,
};
