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

// --- OAuth ---
// GitHub
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);
router.get("/github/callback", (req, res, next) => {
  passport.authenticate("github", (err, user, info) => {
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
  passport.authenticate("google", (err, user, info) => {
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
