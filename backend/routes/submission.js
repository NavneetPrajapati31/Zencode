const express = require("express");
const router = express.Router();
const { authenticateJWT } = require("../middleware/auth");
const {
  createSubmission,
  getSubmissions,
  getSubmissionsByProblem,
  getSubmissionById,
  updateSubmission,
  deleteSubmission,
} = require("../controllers/submission");

// Public routes
router.get("/", getSubmissions);
router.get("/problem/:problemId", authenticateJWT, getSubmissionsByProblem);
router.get("/:id", getSubmissionById);

// Protected routes
router.post("/", authenticateJWT, createSubmission);
router.put("/:id", authenticateJWT, updateSubmission);
router.delete("/:id", authenticateJWT, deleteSubmission);

module.exports = router;
