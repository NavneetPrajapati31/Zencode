const express = require("express");
const authenticateJWT = require("../middleware/auth");

const router = express.Router();

// @route   GET /api/protected
// @desc    Example protected route
// @access  Private (JWT required)
router.get("/", authenticateJWT, (req, res) => {
  res.json({
    message: "You have accessed a protected route!",
    user: req.user,
  });
});

module.exports = router;
