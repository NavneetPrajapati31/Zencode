const express = require("express");
const { signUp, signIn } = require("../controllers/auth");
const passport = require("passport");
const { oauthCallback } = require("../controllers/oauth");

const router = express.Router();

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// @route   POST /api/auth/signup
router.post("/signup", signUp);

// @route   POST /api/auth/signin
router.post("/signin", signIn);

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
