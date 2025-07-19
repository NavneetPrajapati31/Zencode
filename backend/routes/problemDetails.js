const express = require("express");
const router = express.Router();
const { authenticateJWT } = require("../middleware/auth");
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
router.post("/", authenticateJWT, createProblemDetails);
router.put("/:id", authenticateJWT, updateProblemDetails);
router.delete("/:id", authenticateJWT, deleteProblemDetails);

module.exports = router;
