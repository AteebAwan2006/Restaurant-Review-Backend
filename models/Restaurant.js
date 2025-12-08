const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },           // Restaurant name
    description: { type: String, default: "" },      // Description
    address: { type: String, required: true },       // Address
    images: [{ type: String }],                       // Image filenames
    averageRating: { type: Number, default: 0 },     // Average rating from reviews
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Owner reference
  },
  { timestamps: true }
);

module.exports = mongoose.model("Restaurant", restaurantSchema);
