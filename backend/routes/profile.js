const express = require("express");
const {
  authenticateJWT,
  requireProfileComplete,
} = require("../middleware/auth");
const User = require("../models/User");
const { getUserProgress } = require("../controllers/profile-progress");
const Submission = require("../models/Submission");
const dayjs = require("dayjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET =
  process.env.JWT_SECRET ||
  "935dacfee06f8c8bcf458d9fcab55704d0ceaa6a94e05d68796f9905855282e305b2b970baebaa4507d4837157f2829c737547a779c4558e9de3c5";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

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
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }
);

// GET /api/profile/:username/progress
router.get("/:username/progress", async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (user && user.isPublicProfile) {
      // console.log(`[PUBLIC PROGRESS] for ${user.username}`);
      return getUserProgress(req, res, next);
    }
  } catch (e) {
    // console.log("Error in public progress wrapper", e);
  }
  // console.log(`[PRIVATE PROGRESS] for ${req.params.username}`);
  authenticateJWT(req, res, () =>
    requireProfileComplete(req, res, () => getUserProgress(req, res, next))
  );
});

// GET /api/profile/:username/heatmap
router.get(
  "/:username/heatmap",
  async (req, res, next) => {
    try {
      const user = await User.findOne({ username: req.params.username });
      if (user && user.isPublicProfile) {
        // console.log(`[PUBLIC HEATMAP] for ${user.username}`);
        req.user = user; // for downstream logic
        return next();
      }
    } catch (e) {
      // console.log("Error in public heatmap wrapper", e);
    }
    // console.log(`[PRIVATE HEATMAP] for ${req.params.username}`);
    authenticateJWT(req, res, () =>
      requireProfileComplete(req, res, () => next())
    );
  },
  async (req, res) => {
    try {
      const username = req.params.username;
      const user = await User.findOne({ username });
      if (!user) return res.status(404).json({ error: "User not found" });
      const today = dayjs().endOf("day");
      const startDate = today.subtract(364, "day").startOf("day");
      /* console.log(
        `[Heatmap] Date range: ${startDate.toDate()} to ${today.toDate()}`
      );*/
      // Get all submissions for this user in the last 365 days
      const submissions = await Submission.find({
        user: user._id,
        createdAt: { $gte: startDate.toDate(), $lte: today.toDate() },
      });
      /* console.log(
        `[Heatmap] User: ${username}, Submissions found: ${submissions.length}`
      );*/
      submissions.forEach((sub, idx) => {
        /* console.log(
          `[Heatmap] Submission ${idx + 1}: verdict=${sub.verdict}, createdAt=${sub.createdAt}`
        );*/
      });
      // Print all submissions for the user regardless of date
      const allUserSubs = await Submission.find({ user: user._id });
      allUserSubs.forEach((sub, idx) => {
        /* console.log(
          `[Heatmap][AllUserSubs] ${idx + 1}: verdict=${sub.verdict}, createdAt=${sub.createdAt}`
        );*/
      });
      // Print which ones are included in the heatmap
      submissions.forEach((sub, idx) => {
        /* console.log(
          `[Heatmap][InRange] ${idx + 1}: verdict=${sub.verdict}, createdAt=${sub.createdAt}`
        );*/
      });
      // Aggregate by date
      const dateMap = {};
      for (let i = 0; i < 365; i++) {
        const date = startDate.add(i, "day").format("YYYY-MM-DD");
        dateMap[date] = 0;
      }
      submissions.forEach((sub) => {
        const date = dayjs(sub.createdAt).format("YYYY-MM-DD");
        if (dateMap[date] !== undefined) dateMap[date]++;
      });
      const heatmap = Object.entries(dateMap).map(([date, count]) => ({
        date,
        count,
      }));
      res.json({ heatmap });
    } catch (err) {
      console.error("Heatmap error:", err);
      res.status(500).json({ error: "Failed to fetch heatmap data" });
    }
  }
);

// PUT /api/profile/:username/social
router.put(
  "/:username/social",
  authenticateJWT,
  requireProfileComplete,
  async (req, res) => {
    try {
      const { github, linkedin, twitter } = req.body;
      const username = req.params.username;
      // Fetch current socialProfiles
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      // Merge new values with existing ones
      const updatedProfiles = {
        github: github !== undefined ? github : user.socialProfiles.github,
        linkedin:
          linkedin !== undefined ? linkedin : user.socialProfiles.linkedin,
        twitter: twitter !== undefined ? twitter : user.socialProfiles.twitter,
      };
      user.socialProfiles = updatedProfiles;
      await user.save();
      res.json({
        message: "Social profiles updated successfully",
        socialProfiles: user.socialProfiles,
      });
    } catch (error) {
      console.error("Update social profiles error:", error);
      res.status(500).json({ error: "Failed to update social profiles" });
    }
  }
);

// PATCH /api/profile/basic
router.patch("/basic", authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, username, avatar } = req.body;
    console.log("[DEBUG] PATCH /api/profile/basic userId:", userId);
    console.log("[DEBUG] PATCH /api/profile/basic body:", req.body);
    if (!name && !username && !avatar) {
      return res.status(400).json({ message: "No fields to update." });
    }
    const update = {};
    if (name !== undefined && name !== "") update.name = name;
    if (avatar !== undefined) update.avatar = avatar;
    if (username !== undefined && username !== "") {
      // Check if username is unique
      const existing = await User.findOne({ username });
      if (existing && existing._id.toString() !== userId) {
        return res.status(409).json({ message: "Username is already taken." });
      }
      update.username = username;
    }
    console.log("[DEBUG] PATCH /api/profile/basic update object:", update);
    const user = await User.findByIdAndUpdate(userId, update, { new: true });
    console.log("[DEBUG] PATCH /api/profile/basic updated user:", user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    let token;
    if (username && username !== req.user.username) {
      token = jwt.sign(
        {
          id: user._id,
          email: user.email,
          username: user.username,
          role: user.role,
          profileComplete: user.profileComplete,
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );
    }
    res.json({ message: "Profile updated successfully.", user, token });
  } catch (err) {
    console.error("[DEBUG] PATCH /api/profile/basic error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// PATCH /api/profile/password
router.patch("/password", authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Both old and new password are required." });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Old password is incorrect." });
    }
    user.password = newPassword;
    await user.save();
    res.json({ message: "Password updated successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET /api/profile/public/:username
router.get("/public/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user || !user.isPublicProfile) {
      return res.status(404).json({ message: "Public profile not found" });
    }
    // Only return public fields
    const {
      username,
      name,
      avatar,
      socialProfiles,
      solvedProblems,
      createdAt,
    } = user;
    res.json({
      username,
      name,
      avatar,
      socialProfiles,
      solvedProblems,
      createdAt,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.patch("/public", authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id;
    const { isPublicProfile } = req.body;
    if (typeof isPublicProfile !== "boolean") {
      return res
        .status(400)
        .json({ message: "Invalid value for isPublicProfile." });
    }
    await User.findByIdAndUpdate(userId, { isPublicProfile });
    res.json({ message: "Profile visibility updated.", isPublicProfile });
  } catch (err) {
    res.status(500).json({ message: "Failed to update visibility." });
  }
});

module.exports = router;
