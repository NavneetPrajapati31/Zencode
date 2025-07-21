const express = require("express");
const router = express.Router();
const { getLeaderboard, getUserRank } = require("../controllers/leaderboard");

// GET /api/leaderboard
router.get("/", getLeaderboard);
// GET /api/leaderboard/:username
router.get("/:username", getUserRank);

module.exports = router;
