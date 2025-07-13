const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
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
router.post("/", auth, createProblem);
router.put("/:id", auth, updateProblem);
router.delete("/:id", auth, deleteProblem);

module.exports = router;
