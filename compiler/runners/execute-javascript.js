const { executeWithLimits } = require("../utils/resource-limits");

const executeJavascript = async (filePath, input = "") => {
  return executeWithLimits("node", [filePath], {}, input);
};

module.exports = { executeJavascript };
