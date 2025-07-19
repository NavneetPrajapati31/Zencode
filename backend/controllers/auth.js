const User = require("../models/User");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
const JWT_EXPIRES_IN = "7d";

// Helper: Generate JWT
const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

const generateRandomUsername = async (email) => {
  const prefix = (email ? email.split("@")[0] : "user")
    .replace(/[^a-zA-Z0-9_]/g, "_")
    .slice(0, 12);
  let username;
  let exists = true;
  while (exists) {
    username = `${prefix}${Math.floor(1000 + Math.random() * 9000)}`;
    exists = await User.findOne({ username });
  }
  return username;
};

// POST /api/auth/signup
const signUp = async (req, res) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }
    let finalUsername = username;
    let profileComplete = true;
    if (!username) {
      // Try up to 5 times to avoid rare race conditions
      let attempts = 0;
      while (attempts < 5) {
        finalUsername = await generateRandomUsername(email);
        const existingUser = await User.findOne({ username: finalUsername });
        if (!existingUser) break;
        attempts++;
      }
      profileComplete = false;
    } else {
      // Username validation (3-20 chars, alphanumeric/underscore)
      const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
      if (!usernameRegex.test(username)) {
        return res.status(400).json({
          message:
            "Username must be 3-20 characters and contain only letters, numbers, and underscores.",
        });
      }
    }
    const existingUser = await User.findOne({
      $or: [{ email }, { username: finalUsername }],
    });
    if (existingUser) {
      if (existingUser.email === email) {
        return res
          .status(409)
          .json({ message: "User with this email already exists." });
      }
      if (existingUser.username === finalUsername) {
        return res.status(409).json({ message: "Username is already taken." });
      }
    }
    let user;
    try {
      user = new User({
        email,
        password,
        username: finalUsername,
        role: "user",
        profileComplete,
      });
      await user.save();
    } catch (err) {
      // Handle duplicate username error (race condition)
      if (err.code === 11000 && err.keyPattern && err.keyPattern.username) {
        return res
          .status(409)
          .json({ message: "Username is already taken. Please try again." });
      }
      throw err;
    }
    const token = generateToken(user);
    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        profileComplete: user.profileComplete,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// POST /api/auth/signin
const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    const token = generateToken(user);
    res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// POST /api/auth/complete-profile
const completeProfile = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { fullName, username } = req.body;
    if (!fullName || !username) {
      return res
        .status(400)
        .json({ message: "Full name and username are required." });
    }
    // Username validation
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      return res.status(400).json({
        message:
          "Username must be 3-20 characters and contain only letters, numbers, and underscores.",
      });
    }
    const existing = await User.findOne({ username });
    if (existing && existing._id.toString() !== userId) {
      return res.status(409).json({ message: "Username is already taken." });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    user.name = fullName;
    user.username = username;
    user.profileComplete = true;
    await user.save();
    const token = generateToken(user);
    res.json({
      message: "Profile completed.",
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        name: user.name,
        profileComplete: user.profileComplete,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { signUp, signIn, completeProfile };
