// routes/restaurantRoutes.js
const express = require("express");
const router = express.Router();
const { getRestaurants, getRestaurantById, addRestaurant, updateRestaurant, deleteRestaurant } = require("../controllers/restaurantController");
const { protect, ownerOrAdmin } = require("../middleware/authMiddleware");
const { upload } = require("../middleware/uploadMiddleware");

// Public reads
router.get("/", getRestaurants);
router.get("/:id", getRestaurantById);

// Mutations: owner or super-admin
router.post("/", protect, ownerOrAdmin, upload.single("image"), addRestaurant);
router.put("/:id", protect, ownerOrAdmin, upload.single("image"), updateRestaurant);
router.delete("/:id", protect, ownerOrAdmin, deleteRestaurant);

module.exports = router;
