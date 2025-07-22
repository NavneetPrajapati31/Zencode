const Problem = require("../models/Problem");
const TestCase = require("../models/TestCase");

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

// Bulk create problems and details
const bulkCreateProblems = async (req, res) => {
  try {
    const problems = req.body;
    if (!Array.isArray(problems)) {
      return res.status(400).json({ message: "Input must be an array" });
    }
    const results = [];
    for (const item of problems) {
      // Validate required fields
      if (!item.name || !item.statement || !item.code || !item.difficulty) {
        return res.status(400).json({
          message:
            "Each problem must have name, statement, code, and difficulty",
        });
      }
      // Create Problem
      const problem = new Problem({
        name: item.name,
        statement: item.statement,
        code: item.code,
        difficulty: item.difficulty,
      });
      await problem.save();
      // Create ProblemDetails
      const ProblemDetails = require("../models/ProblemDetails");
      const details = new ProblemDetails({
        problemId: problem._id,
        tags: item.tags || [],
        constraints: item.constraints || [],
        examples: item.examples || [],
        boilerplate: item.boilerplate || {},
        harness: item.harness || {},
        originalId: item.originalId || "",
      });
      await details.save();
      // Create TestCases if provided
      let testcases = [];
      if (Array.isArray(item.testcases)) {
        for (const tc of item.testcases) {
          if (!tc.input || !tc.output) {
            return res
              .status(400)
              .json({ message: "Each testcase must have input and output" });
          }
          const testcase = new TestCase({
            input: tc.input,
            output: tc.output,
            problem: problem._id,
          });
          await testcase.save();
          testcases.push(testcase);
        }
      }
      results.push({ problem, details, testcases });
    }
    res.status(201).json({ message: "Bulk insert successful", results });
  } catch (error) {
    res.status(500).json({ message: "Bulk insert failed", error });
  }
};

module.exports = {
  createProblem,
  getProblems,
  getProblemById,
  updateProblem,
  deleteProblem,
  bulkCreateProblems,
};
