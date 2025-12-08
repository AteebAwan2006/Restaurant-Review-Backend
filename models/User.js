// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },                      // User's name
    email: { type: String, required: true, unique: true },       // Unique email
    password: { type: String, required: true },                  // Hashed password
    avatar: { type: String, default: "" },                       // Avatar filename or URL
    role: {
      type: String,
      enum: ["super-admin", "owner", "user"],
      default: "user",
    },                                                           // Role-based access
    failedLoginAttempts: { type: Number, default: 0 },           // Track failed logins
    isBlocked: { type: Boolean, default: false },                // Blocked after failed attempts
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
