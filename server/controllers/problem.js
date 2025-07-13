const Problem = require("../models/Problem");

// Create a new problem
const createProblem = async (req, res) => {
  try {
    const { title, description, difficulty, tags } = req.body;
    const problem = new Problem({
      title,
      description,
      difficulty,
      tags,
      createdBy: req.user.id,
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
    const problems = await Problem.find().populate("createdBy", "username");
    res.json(problems);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get a single problem by ID
const getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id).populate(
      "createdBy",
      "username"
    );
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
    if (problem.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const { title, description, difficulty, tags } = req.body;
    problem.title = title;
    problem.description = description;
    problem.difficulty = difficulty;
    problem.tags = tags;
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
    if (problem.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }
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
