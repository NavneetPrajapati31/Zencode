const mongoose = require("mongoose");

const ProblemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    testcases: [
      {
        input: { type: String, required: true },
        output: { type: String, required: true },
        explanation: { type: String },
      },
    ],
    hiddenTestcases: [
      {
        input: { type: String, required: true },
        output: { type: String, required: true },
      },
    ],
    constraints: [
      {
        type: String,
        trim: true,
      },
    ],
    examples: [
      {
        input: { type: String, required: true },
        output: { type: String, required: true },
        explanation: { type: String },
      },
    ],
    boilerplate: {
      c: { type: String },
      cpp: { type: String },
      python: { type: String },
      javascript: { type: String },
      java: { type: String },
    },
    harness: {
      c: { type: String },
      cpp: { type: String },
      python: { type: String },
      javascript: { type: String },
      java: { type: String },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Problem", ProblemSchema);
