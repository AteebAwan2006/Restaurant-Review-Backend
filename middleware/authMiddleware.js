const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Restaurant = require("../models/Restaurant");

// Protect route
const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization?.split(" ")[1];
    if (!token)
      return res.status(401).json({ message: "Not authorized, no token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) return res.status(401).json({ message: "User not found" });

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token", error: err.message });
  }
};

// Super admin only
const superAdmin = (req, res, next) => {
  if (req.user.role !== "super-admin")
    return res.status(403).json({ message: "Access denied" });
  next();
};

// ⭐ Owner or Super-admin
const ownerOrAdmin = async (req, res, next) => {
  try {
    // if super-admin, allow directly
    if (req.user.role === "super-admin") return next();

    const restaurant = await Restaurant.findById(req.params.id);

    // If adding new restaurant (no id yet), owner is allowed
    if (!restaurant && req.user.role === "owner") return next();

    // Check ownership
    if (restaurant.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    next();
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

module.exports = {
  protect,
  superAdmin,
  ownerOrAdmin,
};
