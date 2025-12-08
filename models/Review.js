const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Who wrote review
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true }, // Restaurant reviewed
    rating: { type: Number, required: true, min: 1, max: 5 }, // 1–5 stars
    comment: { type: String, default: "" },                  // User comment
    reply: { type: String, default: "" },                    // Owner reply
    image: { type: String, default: "" },                    // Optional image
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
