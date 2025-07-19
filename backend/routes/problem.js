const express = require("express");
const router = express.Router();
const { authenticateJWT, authorizeRole } = require("../middleware/auth");
const {
  createProblem,
  getProblems,
  getProblemById,
  updateProblem,
  deleteProblem,
} = require("../controllers/problem");

// Public
router.get("/", getProblems);
router.get("/:id", getProblemById);

// Protected
router.post("/", authenticateJWT, authorizeRole("admin"), createProblem);
router.put("/:id", authenticateJWT, authorizeRole("admin"), updateProblem);
router.delete("/:id", authenticateJWT, authorizeRole("admin"), deleteProblem);

module.exports = router;
