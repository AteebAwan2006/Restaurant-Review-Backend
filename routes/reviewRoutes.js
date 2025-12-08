// routes/reviewRoutes.js
const express = require("express");
const router = express.Router();
const { getReviews, addReview, replyReview } = require("../controllers/reviewController");
const { protect, ownerOrAdmin } = require("../middleware/authMiddleware");

// Public
router.get("/", getReviews);

// Logged-in users add review
router.post("/", protect, addReview);

// Owner or admin reply
router.put("/reply/:id", protect, ownerOrAdmin, replyReview);

module.exports = router;
