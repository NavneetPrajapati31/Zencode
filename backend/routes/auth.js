const express = require("express");
const {
  signUp,
  signIn,
  completeProfile,
  verifyEmail,
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

// @route   POST /api/auth/verify-email
router.post("/verify-email", verifyEmail);

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
router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: FRONTEND_URL + "/signin",
  }),
  oauthCallback
);
// Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: FRONTEND_URL + "/signin",
  }),
  oauthCallback
);

module.exports = router;
