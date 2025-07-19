const Problem = require("../models/Problem");

// Create a new problem
const createProblem = async (req, res) => {
  try {
    const { statement, name, code, difficulty } = req.body;

    if (!statement || !name || !code) {
      return res
        .status(400)
        .json({ message: "Statement, name, and code are required." });
    }

    const problem = new Problem({
      statement,
      name,
      code,
      difficulty,
    });
    await problem.save();
    res.status(201).json(problem);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all problems
const getProblems = async (req, res) => {
  try {
    const problems = await Problem.find();
    res.json(problems);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get a single problem by ID
const getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ message: "Problem not found" });
    res.json(problem);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update a problem
const updateProblem = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ message: "Problem not found" });

    const { statement, name, code, difficulty } = req.body;

    if (statement !== undefined) problem.statement = statement;
    if (name !== undefined) problem.name = name;
    if (code !== undefined) problem.code = code;
    if (difficulty !== undefined) problem.difficulty = difficulty;

    await problem.save();
    res.json(problem);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete a problem
const deleteProblem = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ message: "Problem not found" });
    await problem.deleteOne();
    res.json({ message: "Problem deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  createProblem,
  getProblems,
  getProblemById,
  updateProblem,
  deleteProblem,
};
