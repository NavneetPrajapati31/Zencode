const { executeWithLimits } = require("../utils/resource-limits");

const executePython = async (filePath, input = "") => {
  const pythonCmd = process.platform === "win32" ? "python" : "python3";
  return executeWithLimits(pythonCmd, [filePath], {}, input);
};

module.exports = { executePython };
