const express = require("express");
const router = express.Router();
const {
  authenticateJWT,
  requireProfileComplete,
} = require("../middleware/auth");
const {
  createTestCase,
  getTestCases,
  getTestCasesByProblem,
  getTestCaseById,
  updateTestCase,
  deleteTestCase,
} = require("../controllers/testcase");

// Public routes
router.get("/", getTestCases);
router.get("/problem/:problemId", getTestCasesByProblem);
router.get("/:id", getTestCaseById);

// Protected routes
router.post("/", authenticateJWT, requireProfileComplete, createTestCase);
router.put("/:id", authenticateJWT, requireProfileComplete, updateTestCase);
router.delete("/:id", authenticateJWT, requireProfileComplete, deleteTestCase);

module.exports = router;
