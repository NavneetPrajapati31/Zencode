const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// Helper: Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, avatar: user.avatar, name: user.name },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// Passport callback for OAuth
const oauthCallback = async (req, res) => {
  if (!req.user) {
    return res.redirect(`${FRONTEND_URL}/signin?error=oauth_failed`);
  }
  // Find or create user
  let user = await User.findOne({ email: req.user.email });
  if (!user) {
    user = new User({
      email: req.user.email,
      password: jwt.sign({ t: Date.now() }, JWT_SECRET),
      avatar: req.user.photo || "",
      name: req.user.name || "",
    });
    await user.save();
  } else {
    // Always update name and avatar from OAuth profile
    let updated = false;
    if (req.user.photo && user.avatar !== req.user.photo) {
      user.avatar = req.user.photo;
      updated = true;
    }
    if (req.user.name && user.name !== req.user.name) {
      user.name = req.user.name;
      updated = true;
    }
    if (updated) await user.save();
  }
  const token = generateToken(user);
  // Redirect to frontend with token
  return res.redirect(`${FRONTEND_URL}/oauth/callback?token=${token}`);
};

module.exports = { oauthCallback };
