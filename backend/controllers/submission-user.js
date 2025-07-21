const Submission = require("../models/Submission");
const Problem = require("../models/Problem");
const User = require("../models/User");

// GET /api/submission/user/:username
const getUserSubmissions = async (req, res) => {
  try {
    const username = req.params.username;
    if (!username) return res.status(400).json({ error: "Username required" });
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });
    const submissions = await Submission.find({ user: user._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("problem");
    const formatted = submissions.map((sub) => ({
      _id: sub._id,
      problemTitle: sub.problem?.name || sub.problem?.title || "-",
      createdAt: sub.createdAt,
      verdict: sub.verdict,
      language: sub.language,
    }));
    res.json({ submissions: formatted });
  } catch (error) {
    console.error("User submissions error:", error);
    res.status(500).json({ error: "Failed to fetch user submissions." });
  }
};

module.exports = { getUserSubmissions };
