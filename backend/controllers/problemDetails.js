const ProblemDetails = require("../models/ProblemDetails");
const Problem = require("../models/Problem");

// Create problem details
const createProblemDetails = async (req, res) => {
  try {
    const {
      problemId,
      tags,
      constraints,
      examples,
      boilerplate,
      harness,
      originalId,
    } = req.body;

    if (!problemId) {
      return res.status(400).json({ message: "Problem ID is required." });
    }

    // Check if problem exists
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    // Check if details already exist for this problem
    const existingDetails = await ProblemDetails.findOne({ problemId });
    if (existingDetails) {
      return res
        .status(409)
        .json({ message: "Problem details already exist for this problem" });
    }

    const problemDetails = new ProblemDetails({
      problemId,
      tags: tags || [],
      constraints: constraints || [],
      examples: examples || [],
      boilerplate: boilerplate || {},
      harness: harness || {},
      originalId,
    });
    await problemDetails.save();

    // Populate problem details
    await problemDetails.populate("problemId");
    res.status(201).json(problemDetails);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all problem details
const getProblemDetails = async (req, res) => {
  try {
    const problemDetails = await ProblemDetails.find().populate("problemId");
    res.json(problemDetails);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get problem details by problem ID
const getProblemDetailsByProblem = async (req, res) => {
  try {
    const { problemId } = req.params;
    const problemDetails = await ProblemDetails.findOne({ problemId }).populate(
      "problemId"
    );
    if (!problemDetails) {
      return res.status(404).json({ message: "Problem details not found" });
    }
    res.json(problemDetails);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get problem details by ID
const getProblemDetailsById = async (req, res) => {
  try {
    const problemDetails = await ProblemDetails.findById(
      req.params.id
    ).populate("problemId");
    if (!problemDetails)
      return res.status(404).json({ message: "Problem details not found" });
    res.json(problemDetails);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update problem details
const updateProblemDetails = async (req, res) => {
  try {
    const problemDetails = await ProblemDetails.findById(req.params.id);
    if (!problemDetails)
      return res.status(404).json({ message: "Problem details not found" });

    const { tags, constraints, examples, boilerplate, harness, originalId } =
      req.body;

    if (tags !== undefined) problemDetails.tags = tags;
    if (constraints !== undefined) problemDetails.constraints = constraints;
    if (examples !== undefined) problemDetails.examples = examples;
    if (boilerplate !== undefined) problemDetails.boilerplate = boilerplate;
    if (harness !== undefined) problemDetails.harness = harness;
    if (originalId !== undefined) problemDetails.originalId = originalId;

    await problemDetails.save();
    await problemDetails.populate("problemId");
    res.json(problemDetails);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete problem details
const deleteProblemDetails = async (req, res) => {
  try {
    const problemDetails = await ProblemDetails.findById(req.params.id);
    if (!problemDetails)
      return res.status(404).json({ message: "Problem details not found" });
    await problemDetails.deleteOne();
    res.json({ message: "Problem details deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get problem with full details (problem + details)
const getProblemWithDetails = async (req, res) => {
  try {
    const { problemId } = req.params;

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const problemDetails = await ProblemDetails.findOne({ problemId });

    const result = {
      problem: problem,
      details: problemDetails || null,
    };

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  createProblemDetails,
  getProblemDetails,
  getProblemDetailsByProblem,
  getProblemDetailsById,
  updateProblemDetails,
  deleteProblemDetails,
  getProblemWithDetails,
};
