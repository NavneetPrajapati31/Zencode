const express = require("express");
const {
  signUp,
  signIn,
  completeProfile,
  verifyOTP,
  resendOTP,
  forgotPassword,
  resetPassword,
  validateResetToken,
  resendVerification,
} = require("../controllers/auth");
const passport = require("passport");
const { oauthCallback } = require("../controllers/oauth");
const { authenticateJWT } = require("../middleware/auth");
const User = require("../models/User"); // Added missing import for User model

const router = express.Router();

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// @route   POST /api/auth/signup
router.post("/signup", signUp);

// @route   POST /api/auth/signin
router.post("/signin", signIn);

// @route   POST /api/auth/complete-profile
router.post("/complete-profile", authenticateJWT, completeProfile);

// @route   POST /api/auth/verify-otp
router.post("/verify-otp", verifyOTP);

// @route   POST /api/auth/resend-otp
router.post("/resend-otp", resendOTP);

// @route   POST /api/auth/forgot-password
router.post("/forgot-password", forgotPassword);

// @route   POST /api/auth/reset-password
router.post("/reset-password", resetPassword);

// @route   GET /api/auth/validate-reset-token/:token
router.get("/validate-reset-token/:token", validateResetToken);

// @route   POST /api/auth/resend-verification
router.post("/resend-verification", authenticateJWT, resendVerification);

// @route   POST /api/auth/verify-token
router.post("/verify-token", authenticateJWT, async (req, res) => {
  try {
    // If we reach here, the token is valid (authenticateJWT middleware passed)
    res.json({ valid: true, user: req.user });
  } catch (error) {
    res.status(401).json({ valid: false, message: "Invalid token" });
  }
});

// @route   POST /api/auth/refresh-token
router.post("/refresh-token", authenticateJWT, async (req, res) => {
  try {
    // If we reach here, the token is valid
    // Generate a new token with extended expiration
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const jwt = require("jsonwebtoken");
    const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";
    const newToken = jwt.sign(
      {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        profileComplete: user.profileComplete,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token: newToken,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        profileComplete: user.profileComplete,
      },
    });
  } catch (error) {
    console.error("Token refresh error:", error);
    res.status(500).json({ message: "Failed to refresh token" });
  }
});

// --- OAuth ---
// GitHub
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);
router.get("/github/callback", (req, res, next) => {
  passport.authenticate("github", { session: false }, (err, user, info) => {
    if (err) {
      const timestamp = new Date().toISOString();
      console.error(`[${timestamp}] Passport GitHub error:`, err);
      if (err && err.message) console.error("Error message:", err.message);
      if (err && err.stack) console.error("Error stack:", err.stack);
      if (err && err.oauthError) {
        console.error("OAuth error:", err.oauthError);
        if (err.oauthError.data) {
          console.error("OAuth error data:", err.oauthError.data);
        }
      }
      return res.redirect(
        `${FRONTEND_URL || "http://localhost:5173"}/signin?error=oauth_error`
      );
    }
    if (!user) {
      return res.redirect(
        `${FRONTEND_URL || "http://localhost:5173"}/signin?error=oauth_failed`
      );
    }
    req.user = user;
    return oauthCallback(req, res);
  })(req, res, next);
});
// Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get("/google/callback", (req, res, next) => {
  passport.authenticate("google", { session: false }, (err, user, info) => {
    if (err) {
      const timestamp = new Date().toISOString();
      console.error(`[${timestamp}] Passport Google error:`, err);
      if (err && err.message) console.error("Error message:", err.message);
      if (err && err.stack) console.error("Error stack:", err.stack);
      if (err && err.oauthError) {
        console.error("OAuth error:", err.oauthError);
        if (err.oauthError.data) {
          console.error("OAuth error data:", err.oauthError.data);
        }
      }
      return res.redirect(
        `${FRONTEND_URL || "http://localhost:5173"}/signin?error=oauth_error`
      );
    }
    if (!user) {
      return res.redirect(
        `${FRONTEND_URL || "http://localhost:5173"}/signin?error=oauth_failed`
      );
    }
    req.user = user;
    return oauthCallback(req, res);
  })(req, res, next);
});

module.exports = router;
