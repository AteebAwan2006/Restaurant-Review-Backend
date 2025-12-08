// controllers/reviewController.js
const Review = require("../models/Review");
const Restaurant = require("../models/Restaurant");

// Get all reviews (public)
const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user", "name avatar")
      .populate("restaurant", "name address");
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Add review + rating (logged-in user)
const addReview = async (req, res) => {
  try {
    const { restaurant: restaurantId, rating, comment } = req.body;
    if (!req.user || !req.user._id) return res.status(401).json({ message: "Not authenticated" });

    // Create review
    const review = await Review.create({
      user: req.user._id,
      restaurant: restaurantId,
      rating,
      comment,
    });

    // Recalculate average rating
    const reviews = await Review.find({ restaurant: restaurantId });
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    const restaurant = await Restaurant.findById(restaurantId);
    if (restaurant) {
      restaurant.averageRating = avg;
      await restaurant.save();
    }

    res.status(201).json({ message: "Review added", review });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Owner or super-admin reply to a review
const replyReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id).populate("restaurant");
    if (!review) return res.status(404).json({ message: "Review not found" });

    // check ownership of restaurant
    if (review.restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== "super-admin")
      return res.status(403).json({ message: "Not authorized to reply" });

    review.reply = req.body.reply || "";
    await review.save();

    res.json({ message: "Reply added", review });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

module.exports = { getReviews, addReview, replyReview };
