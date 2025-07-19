const Submission = require("../models/Submission");
const Problem = require("../models/Problem");

// Create a new submission
const createSubmission = async (req, res) => {
  try {
    const { problemId, verdict } = req.body;

    if (!problemId || !verdict) {
      return res
        .status(400)
        .json({ message: "Problem ID and verdict are required." });
    }

    // Check if problem exists
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const submission = new Submission({
      problem: problemId,
      verdict,
    });
    await submission.save();

    // Populate problem details
    await submission.populate("problem");
    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all submissions
const getSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find().populate("problem");
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get submissions by problem ID
const getSubmissionsByProblem = async (req, res) => {
  try {
    const { problemId } = req.params;
    const submissions = await Submission.find({ problem: problemId }).populate(
      "problem"
    );
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get a single submission by ID
const getSubmissionById = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id).populate(
      "problem"
    );
    if (!submission)
      return res.status(404).json({ message: "Submission not found" });
    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update a submission
const updateSubmission = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission)
      return res.status(404).json({ message: "Submission not found" });

    const { verdict } = req.body;

    if (verdict !== undefined) submission.verdict = verdict;

    await submission.save();
    await submission.populate("problem");
    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete a submission
const deleteSubmission = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission)
      return res.status(404).json({ message: "Submission not found" });
    await submission.deleteOne();
    res.json({ message: "Submission deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  createSubmission,
  getSubmissions,
  getSubmissionsByProblem,
  getSubmissionById,
  updateSubmission,
  deleteSubmission,
};
