const express = require("express");
const { signUp, signIn } = require("../controllers/auth");

const router = express.Router();

// @route   POST /api/auth/signup
router.post("/signup", signUp);

// @route   POST /api/auth/signin
router.post("/signin", signIn);

module.exports = router;
