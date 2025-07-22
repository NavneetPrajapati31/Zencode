const express = require("express");
const router = express.Router();
const { authenticateJWT, authorizeRole } = require("../middleware/auth");
const {
  createProblem,
  getProblems,
  getProblemById,
  updateProblem,
  deleteProblem,
  bulkCreateProblems,
} = require("../controllers/problem");
const Problem = require("../models/Problem");

// Public
router.get("/", getProblems);
router.post("/bulk", bulkCreateProblems);

// GET /api/problems/count
router.get("/count", async (req, res) => {
  try {
    console.log("[PROBLEMS COUNT] Public endpoint hit");
    const count = await Problem.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: "Failed to count problems" });
  }
});

router.get("/:id", getProblemById);

// Protected
router.post("/", authenticateJWT, authorizeRole("admin"), createProblem);
router.put("/:id", authenticateJWT, authorizeRole("admin"), updateProblem);
router.delete("/:id", authenticateJWT, authorizeRole("admin"), deleteProblem);

module.exports = router;
