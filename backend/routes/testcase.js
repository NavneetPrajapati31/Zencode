const express = require("express");
const router = express.Router();
const { authenticateJWT } = require("../middleware/auth");
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
router.post("/", authenticateJWT, createTestCase);
router.put("/:id", authenticateJWT, updateTestCase);
router.delete("/:id", authenticateJWT, deleteTestCase);

module.exports = router;
