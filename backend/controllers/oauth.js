const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "935dacfee06f8c8bcf458d9fcab55704d0ceaa6a94e05d68796f9905855282f5a67d8322e305b2b970baebaa4507d4837157f2829c737547a779c4558e9de3c5";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// Helper: Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, avatar: user.avatar, name: user.name },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
};

const generateRandomUsername = async (email) => {
  const prefix = email
    .split("@")[0]
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

// Passport callback for OAuth
const oauthCallback = async (req, res) => {
  if (!req.user) {
    return res.redirect(`${FRONTEND_URL}/signin?error=oauth_failed`);
  }
  // Find or create user
  let user = await User.findOne({ email: req.user.email });
  if (!user) {
    const username = await generateRandomUsername(req.user.email);
    user = new User({
      email: req.user.email,
      password: jwt.sign({ t: Date.now() }, JWT_SECRET),
      avatar: req.user.photo || "",
      name: req.user.name || "",
      username,
      profileComplete: false,
    });
    await user.save();
  } else {
    // Only update avatar if user.avatar is empty (never set by user)
    let updated = false;
    if (req.user.photo && (!user.avatar || user.avatar === "")) {
      user.avatar = req.user.photo;
      updated = true;
    }
    // Only update name if user.name is empty (never set by user)
    if (req.user.name && (!user.name || user.name === "")) {
      user.name = req.user.name;
      updated = true;
    }
    if (updated) await user.save();
  }
  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      avatar: user.avatar,
      name: user.name,
      username: user.username,
      profileComplete: user.profileComplete,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
  // Redirect to frontend with token and profileComplete flag
  return res.redirect(
    `${FRONTEND_URL}/oauth/callback?token=${token}&profileComplete=${user.profileComplete}`
  );
};

module.exports = { oauthCallback };
