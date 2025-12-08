const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

// REGISTER USER
const registerUser = async (req, res) => {
  try {
    const { name, email, password, isAdmin } = req.body;
    
    const isAdminFlag = isAdmin === true || isAdmin === 'true';

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    // Count total users in system
    const userCount = await User.countDocuments();
    
    let role = "user";
    if (isAdminFlag) {
      if (userCount === 0) {
        // Very first user in system gets super-admin if requesting admin
        role = "super-admin";
      } else {
        
        role = "owner";
      }
    }

    const user = await User.create({ name, email, password: hashed, role });

    // Debug log
    console.debug('Registered user:', { email: user.email, role: user.role, id: user._id });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// LOGIN USER
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (user.isBlocked)
      return res.status(403).json({ message: "Account blocked." });

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      user.failedLoginAttempts += 1;
      if (user.failedLoginAttempts >= 3) user.isBlocked = true;
      await user.save();
      return res.status(400).json({ message: "Invalid credentials" });
    }

    user.failedLoginAttempts = 0;
    await user.save();

    const token = generateToken(user._id, user.role);

    res.json({
      message: "Login success",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// UNBLOCK USER
const unblockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isBlocked = false;
    user.failedLoginAttempts = 0;

    await user.save();

    res.json({ message: "User unblocked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// EXPORT CORRECTLY
module.exports = {
  registerUser,
  loginUser,
  unblockUser,
};
