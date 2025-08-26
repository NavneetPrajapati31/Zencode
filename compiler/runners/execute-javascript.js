const fs = require("fs");
const path = require("path");
const { executeWithLimits } = require("../utils/resource-limits");

const executeJavascript = async (filePath, input = "") => {
  // Check if this is a virtual file (in-memory compilation)
  const isVirtual = typeof filePath === "object" && filePath.isVirtual;

  if (isVirtual) {
    console.log(
      "[JavaScript Runner] Using in-memory execution for serverless environment"
    );
    return executeJavascriptVirtual(filePath, input);
  }

  // Original file-based execution logic
  return executeWithLimits("node", [filePath], {}, input);
};

// New function for in-memory execution (serverless)
const executeJavascriptVirtual = async (virtualFile, input = "") => {
  console.log(
    "[JavaScript Runner] Virtual execution for:",
    virtualFile.fileName
  );

  // For JavaScript, we can execute directly from memory using -e flag
  // But for compatibility with resource limits, we'll use temporary file
  const tmpDir = "/tmp";
  const tmpFilePath = path.join(tmpDir, virtualFile.fileName);

  try {
    // Write code to temporary file
    fs.writeFileSync(tmpFilePath, virtualFile.content);
    console.log(
      "[JavaScript Runner] Wrote code to temporary file:",
      tmpFilePath
    );

    const result = await executeWithLimits(
      "node",
      [tmpFilePath],
      { cwd: tmpDir },
      input
    );

    // Clean up temporary file
    try {
      if (fs.existsSync(tmpFilePath)) fs.unlinkSync(tmpFilePath);
    } catch (cleanupError) {
      console.log("[JavaScript Runner] Cleanup error:", cleanupError);
    }

    return result;
  } catch (error) {
    console.log("[JavaScript Runner] Error in virtual execution:", error);
    throw error;
  }
};

module.exports = { executeJavascript };
