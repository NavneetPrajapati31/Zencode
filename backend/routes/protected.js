const express = require("express");
const { authenticateJWT } = require("../middleware/auth");

const router = express.Router();

// @route   GET /api/protected
// @desc    Example protected route
// @access  Private (JWT required)
const User = require("../models/User");
router.get("/", authenticateJWT, async (req, res) => {
  try {
    const user = await User.findById(req.user._id || req.user.id).populate(
      "solvedProblems"
    );
    res.json({
      message: "You have accessed a protected route!",
      user,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
