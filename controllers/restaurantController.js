// controllers/restaurantController.js
const Restaurant = require("../models/Restaurant");
const Review = require("../models/Review");

// GET all restaurants (public)
const getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find().populate("owner", "name email");
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// GET single restaurant (public)
const getRestaurantById = async (req, res) => {
  try {
    const r = await Restaurant.findById(req.params.id).populate("owner", "name email");
    if (!r) return res.status(404).json({ message: "Restaurant not found" });
    res.json(r);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// ADD restaurant (owner or super-admin)
const addRestaurant = async (req, res) => {
  try {
    // req.user provided by protect middleware
    const { name, description, address } = req.body;
    const images = req.file ? [req.file.filename] : [];

    // owner will be the creator (owner or admin)
    const restaurant = await Restaurant.create({
      name,
      description,
      address,
      images,
      owner: req.user._id,
    });

    res.status(201).json({ message: "Restaurant created", restaurant });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// UPDATE restaurant (owner or super-admin)
const updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    // Only restaurant owner or super-admin can update
    if (restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== "super-admin")
      return res.status(403).json({ message: "Not authorized" });

    // Update fields
    restaurant.name = req.body.name || restaurant.name;
    restaurant.description = req.body.description || restaurant.description;
    restaurant.address = req.body.address || restaurant.address;
    if (req.file) restaurant.images = [req.file.filename];

    await restaurant.save();
    res.json({ message: "Restaurant updated", restaurant });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// DELETE restaurant (owner or super-admin)
const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    if (restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== "super-admin")
      return res.status(403).json({ message: "Not authorized" });

    await restaurant.deleteOne();
    res.json({ message: "Restaurant deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

module.exports = { getRestaurants, getRestaurantById, addRestaurant, updateRestaurant, deleteRestaurant };
