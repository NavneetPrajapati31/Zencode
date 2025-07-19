const User = require("../models/User");

// GET /api/leaderboard?page=1&limit=10
const getLeaderboard = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Count total users for pagination
    const totalUsers = await User.countDocuments();

    // Fetch users sorted by solvedProblems length (descending)
    const users = await User.find()
      .sort({ solvedProblems: -1 })
      .skip(skip)
      .limit(limit)
      .select("name username avatar solvedProblems");

    // Map to leaderboard format
    const leaderboard = users.map((user) => ({
      name: user.name || user.username,
      handle: `@${user.username}`,
      avatar: user.avatar,
      totalQuestions: user.solvedProblems.length,
    }));

    res.json({
      data: leaderboard,
      page,
      limit,
      total: totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
    });
  } catch (error) {
    console.error("Leaderboard fetch error:", error);
    res.status(500).json({ error: "Failed to fetch leaderboard." });
  }
};

module.exports = { getLeaderboard };
