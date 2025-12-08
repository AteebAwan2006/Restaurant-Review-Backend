// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const { getUsers, getUserById, updateUser, createOwner, deleteUser } = require("../controllers/userController");
const { protect, superAdmin } = require("../middleware/authMiddleware");

// Only super-admin can list and delete users and create owners
router.get("/", protect, superAdmin, getUsers);
router.post("/create-owner", protect, superAdmin, createOwner);
router.delete("/:id", protect, superAdmin, deleteUser);

// Get and update user (self or super-admin)
router.get("/:id", protect, getUserById);
router.put("/:id", protect, updateUser);

module.exports = router;
