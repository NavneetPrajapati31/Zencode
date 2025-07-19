const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
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
router.get("/problem/:problemId", auth, getSubmissionsByProblem);
router.get("/:id", getSubmissionById);

// Protected routes
router.post("/", auth, createSubmission);
router.put("/:id", auth, updateSubmission);
router.delete("/:id", auth, deleteSubmission);

module.exports = router;
