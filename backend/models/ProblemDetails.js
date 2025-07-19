const mongoose = require("mongoose");

const ProblemDetailsSchema = new mongoose.Schema(
  {
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
    tags: [String],
    constraints: [String],
    examples: [
      {
        input: String,
        output: String,
        explanation: String,
      },
    ],
    boilerplate: {
      c: String,
      cpp: String,
      python: String,
      javascript: String,
      java: String,
    },
    harness: {
      c: String,
      cpp: String,
      python: String,
      javascript: String,
      java: String,
    },
    originalId: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ProblemDetails", ProblemDetailsSchema);
