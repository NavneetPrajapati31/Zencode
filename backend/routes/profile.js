const express = require("express");
const {
  authenticateJWT,
  requireProfileComplete,
} = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

// @route   GET /api/profile/:username
// @desc    Get user profile by username
// @access  Private (JWT required)
router.get(
  "/:username",
  authenticateJWT,
  requireProfileComplete,
  async (req, res) => {
    try {
      const user = await User.findOne({
        username: req.params.username,
      }).populate("solvedProblems");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ user });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }
);

module.exports = router;
