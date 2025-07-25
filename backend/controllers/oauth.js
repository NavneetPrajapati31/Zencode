const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");

// Environment detection
const isProd = process.env.NODE_ENV === "production";

// Config: JWT secret and frontend URL
const JWT_SECRET = process.env.JWT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL;

if (isProd) {
  if (!JWT_SECRET) throw new Error("JWT_SECRET must be set in production");
  if (!FRONTEND_URL) throw new Error("FRONTEND_URL must be set in production");
} else {
  // Dev fallbacks
  if (!JWT_SECRET) {
    console.warn("Warning: Using fallback JWT_SECRET in development");
  }
}

const corsOptions = {
  origin: FRONTEND_URL,
  credentials: true,
};

// Helper: Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      avatar: user.avatar,
      name: user.name,
      username: user.username,
      profileComplete: user.profileComplete,
      role: user.role,
    },
    JWT_SECRET ||
      "935dacfee06f8c8bcf458d9fcab55704d0ceaa6a94e05d68796f9905855282f5a67d8322e305b2b970baebaa4507d4837157f2829c737547a779c4558e9de3c5",
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
  try {
    if (!req.user) {
      return res.redirect(
        `${FRONTEND_URL || "http://localhost:5173"}/signin?error=oauth_failed`
      );
    }
    // Find or create user
    let user = await User.findOne({ email: req.user.email });
    if (!user) {
      const username = await generateRandomUsername(req.user.email);
      user = new User({
        email: req.user.email,
        password: jwt.sign({ t: Date.now() }, JWT_SECRET || "dev"),
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
    const token = generateToken(user);

    // In production: set JWT as HTTP-only, secure cookie
    if (isProd) {
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      // Add token to the redirect URL for frontend to complete login
      return res.redirect(
        `${FRONTEND_URL}/oauth/callback?token=${token}&profileComplete=${user.profileComplete}`
      );
    } else {
      // In dev: pass token in query param for easier debugging
      return res.redirect(
        `${FRONTEND_URL || "http://localhost:5173"}/oauth/callback?token=${token}&profileComplete=${user.profileComplete}`
      );
    }
  } catch (err) {
    // Detailed error logging for OAuth failures
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] OAuth callback error:`);
    console.error("Error object:", err);
    if (err && err.message) console.error("Error message:", err.message);
    if (err && err.stack) console.error("Error stack:", err.stack);
    if (err && err.response) {
      console.error("Error response status:", err.response.status);
      console.error("Error response data:", err.response.data);
    }
    const safeMsg = isProd ? "oauth_error" : encodeURIComponent(err.message);
    return res.redirect(
      `${FRONTEND_URL || "http://localhost:5173"}/signin?error=${safeMsg}`
    );
  }
};

module.exports = { oauthCallback };
