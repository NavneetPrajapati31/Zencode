const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
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
router.post("/", auth, createTestCase);
router.put("/:id", auth, updateTestCase);
router.delete("/:id", auth, deleteTestCase);

module.exports = router;
