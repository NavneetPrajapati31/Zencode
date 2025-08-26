const fs = require("fs");
const path = require("path");
const { executeWithLimits } = require("../utils/resource-limits");

const executePython = async (filePath, input = "") => {
  // Check if this is a virtual file (in-memory compilation)
  const isVirtual = typeof filePath === "object" && filePath.isVirtual;

  if (isVirtual) {
    console.log(
      "[Python Runner] Using in-memory execution for serverless environment"
    );
    return executePythonVirtual(filePath, input);
  }

  // Original file-based execution logic
  const pythonCmd = process.platform === "win32" ? "python" : "python3";
  return executeWithLimits(pythonCmd, [filePath], {}, input);
};

// New function for in-memory execution (serverless)
const executePythonVirtual = async (virtualFile, input = "") => {
  console.log("[Python Runner] Virtual execution for:", virtualFile.fileName);

  // For Python, we can execute directly from memory using -c flag
  // But for compatibility with resource limits, we'll use temporary file
  const tmpDir = "/tmp";
  const tmpFilePath = path.join(tmpDir, virtualFile.fileName);

  try {
    // Write code to temporary file
    fs.writeFileSync(tmpFilePath, virtualFile.content);
    console.log("[Python Runner] Wrote code to temporary file:", tmpFilePath);

    const pythonCmd = "python3";
    const result = await executeWithLimits(
      pythonCmd,
      [tmpFilePath],
      { cwd: tmpDir },
      input
    );

    // Clean up temporary file
    try {
      if (fs.existsSync(tmpFilePath)) fs.unlinkSync(tmpFilePath);
    } catch (cleanupError) {
      console.log("[Python Runner] Cleanup error:", cleanupError);
    }

    return result;
  } catch (error) {
    console.log("[Python Runner] Error in virtual execution:", error);
    throw error;
  }
};

module.exports = { executePython };
