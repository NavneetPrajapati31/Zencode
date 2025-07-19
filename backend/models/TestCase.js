const mongoose = require("mongoose");

const TestCaseSchema = new mongoose.Schema(
  {
    input: {
      type: String,
      required: true,
      trim: true,
    },
    output: {
      type: String,
      required: true,
      trim: true,
    },
    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("TestCase", TestCaseSchema);
