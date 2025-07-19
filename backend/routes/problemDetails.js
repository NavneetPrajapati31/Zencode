const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  createProblemDetails,
  getProblemDetails,
  getProblemDetailsByProblem,
  getProblemDetailsById,
  updateProblemDetails,
  deleteProblemDetails,
  getProblemWithDetails,
} = require("../controllers/problemDetails");

// Public routes
router.get("/", getProblemDetails);
router.get("/problem/:problemId", getProblemDetailsByProblem);
router.get("/:id", getProblemDetailsById);
router.get("/full/:problemId", getProblemWithDetails);

// Protected routes
router.post("/", auth, createProblemDetails);
router.put("/:id", auth, updateProblemDetails);
router.delete("/:id", auth, deleteProblemDetails);

module.exports = router;
