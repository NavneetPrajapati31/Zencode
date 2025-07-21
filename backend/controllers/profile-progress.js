const User = require("../models/User");
const Problem = require("../models/Problem");

// GET /api/profile/:username/progress
const getUserProgress = async (req, res) => {
  try {
    const username = req.params.username;
    if (!username) return res.status(400).json({ error: "Username required" });
    const user = await User.findOne({ username }).populate("solvedProblems");
    if (!user) return res.status(404).json({ error: "User not found" });
    const stats = { easy: 0, medium: 0, hard: 0 };
    user.solvedProblems.forEach((problem) => {
      if (problem.difficulty === "Easy") stats.easy++;
      else if (problem.difficulty === "Medium") stats.medium++;
      else if (problem.difficulty === "Hard") stats.hard++;
    });
    res.json({ stats });
  } catch (error) {
    console.error("Profile progress error:", error);
    res.status(500).json({ error: "Failed to fetch user progress." });
  }
};

module.exports = { getUserProgress };
