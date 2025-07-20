const User = require("../models/User");
const Submission = require("../models/Submission");
const Problem = require("../models/Problem");

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

    // Scoring constants
    const DIFFICULTY_POINTS = {
      Easy: 10,
      Medium: 20,
      Hard: 30,
    };
    const PENALTY_PER_EXTRA_SUBMISSION = 2;
    const MIN_SCORE_PER_PROBLEM = 1;

    // Map to leaderboard format with score calculation
    const leaderboard = await Promise.all(
      users.map(async (user) => {
        let score = 0;
        let totalSubmissions = 0;
        // For each solved problem
        for (const problemId of user.solvedProblems) {
          // Get problem difficulty
          const problem =
            await Problem.findById(problemId).select("difficulty");
          const difficulty = problem?.difficulty || "Easy";
          const basePoints = DIFFICULTY_POINTS[difficulty] || 10;
          // Get all submissions for this user/problem
          const submissions = await Submission.find({
            user: user._id,
            problem: problemId,
          });
          const submissionCount = submissions.length;
          totalSubmissions += submissionCount;
          // Calculate penalty
          const penalty = Math.max(
            0,
            (submissionCount - 1) * PENALTY_PER_EXTRA_SUBMISSION
          );
          // Calculate problem score
          const problemScore = Math.max(
            MIN_SCORE_PER_PROBLEM,
            basePoints - penalty
          );
          score += problemScore;
        }
        return {
          name: user.name || user.username,
          handle: `@${user.username}`,
          avatar: user.avatar,
          totalQuestions: user.solvedProblems.length,
          totalSubmissions,
          score,
        };
      })
    );

    // Sort leaderboard by score descending
    leaderboard.sort((a, b) => b.score - a.score);

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
