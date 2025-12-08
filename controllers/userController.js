// controllers/userController.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// GET all users - super-admin only
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// GET single user - self or super-admin
const getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    if (req.user.role !== "super-admin" && req.user._id.toString() !== id)
      return res.status(403).json({ message: "Access denied" });

    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Update user - self or super-admin
const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    if (req.user.role !== "super-admin" && req.user._id.toString() !== id)
      return res.status(403).json({ message: "Access denied" });

    const updates = { ...req.body };
    // If password updated, hash it
    if (updates.password) updates.password = await bcrypt.hash(updates.password, 10);

    const user = await User.findByIdAndUpdate(id, updates, { new: true }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User updated", user });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Create owner - only super-admin
const createOwner = async (req, res) => {
  try {
    if (req.user.role !== "super-admin") return res.status(403).json({ message: "Access denied" });

    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const owner = await User.create({ name, email, password: hashed, role: "owner" });

    res.status(201).json({ message: "Owner created", owner: { _id: owner._id, name: owner.name, email: owner.email, role: owner.role } });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Delete user - super-admin only
const deleteUser = async (req, res) => {
  try {
    if (req.user.role !== "super-admin") return res.status(403).json({ message: "Access denied" });
    const id = req.params.id;
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

module.exports = { getUsers, getUserById, updateUser, createOwner, deleteUser };
