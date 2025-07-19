const TestCase = require("../models/TestCase");
const Problem = require("../models/Problem");

// Create a new test case
const createTestCase = async (req, res) => {
  try {
    const { problemId, input, output } = req.body;

    if (!problemId || !input || !output) {
      return res
        .status(400)
        .json({ message: "Problem ID, input, and output are required." });
    }

    // Check if problem exists
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const testCase = new TestCase({
      problem: problemId,
      input,
      output,
    });
    await testCase.save();

    // Populate problem details
    await testCase.populate("problem");
    res.status(201).json(testCase);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all test cases
const getTestCases = async (req, res) => {
  try {
    const testCases = await TestCase.find().populate("problem");
    res.json(testCases);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get test cases by problem ID
const getTestCasesByProblem = async (req, res) => {
  try {
    const { problemId } = req.params;
    const testCases = await TestCase.find({ problem: problemId }).populate(
      "problem"
    );
    res.json(testCases);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get a single test case by ID
const getTestCaseById = async (req, res) => {
  try {
    const testCase = await TestCase.findById(req.params.id).populate("problem");
    if (!testCase)
      return res.status(404).json({ message: "Test case not found" });
    res.json(testCase);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update a test case
const updateTestCase = async (req, res) => {
  try {
    const testCase = await TestCase.findById(req.params.id);
    if (!testCase)
      return res.status(404).json({ message: "Test case not found" });

    const { input, output } = req.body;

    if (input !== undefined) testCase.input = input;
    if (output !== undefined) testCase.output = output;

    await testCase.save();
    await testCase.populate("problem");
    res.json(testCase);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete a test case
const deleteTestCase = async (req, res) => {
  try {
    const testCase = await TestCase.findById(req.params.id);
    if (!testCase)
      return res.status(404).json({ message: "Test case not found" });
    await testCase.deleteOne();
    res.json({ message: "Test case deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  createTestCase,
  getTestCases,
  getTestCasesByProblem,
  getTestCaseById,
  updateTestCase,
  deleteTestCase,
};
