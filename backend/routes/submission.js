const express = require("express");
const router = express.Router();
const {
  authenticateJWT,
  requireProfileComplete,
} = require("../middleware/auth");
const {
  createSubmission,
  getSubmissions,
  getSubmissionsByProblem,
  getSubmissionById,
  updateSubmission,
  deleteSubmission,
} = require("../controllers/submission");
const { getUserSubmissions } = require("../controllers/submission-user");

// Public routes
router.get("/", async (req, res) => {
  try {
    const submissions = await require("../models/Submission").find();
    submissions.forEach((sub, idx) => {
      console.log(
        `[AllSubs] Submission ${idx + 1}: verdict=${sub.verdict}, createdAt=${sub.createdAt}, user=${sub.user}`
      );
    });
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
});
router.get("/problem/:problemId", authenticateJWT, getSubmissionsByProblem);
router.get("/user/:username", getUserSubmissions);
router.get("/:id", getSubmissionById);

// Protected routes
router.post("/", authenticateJWT, requireProfileComplete, createSubmission);
router.put("/:id", authenticateJWT, requireProfileComplete, updateSubmission);
router.delete(
  "/:id",
  authenticateJWT,
  requireProfileComplete,
  deleteSubmission
);

module.exports = router;
