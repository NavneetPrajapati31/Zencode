const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { executeWithLimits } = require("../utils/resource-limits");

const outputPath = path.join(__dirname, "../outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeC = async (filePath, input = "") => {
  // Check if this is a virtual file (in-memory compilation)
  const isVirtual = typeof filePath === "object" && filePath.isVirtual;

  if (isVirtual) {
    console.log(
      "[C Runner] Using in-memory execution for serverless environment"
    );
    return executeCVirtual(filePath, input);
  }

  // Original file-based execution logic
  const outputId = path.basename(filePath).split(".")[0];
  const isWindows = process.platform === "win32";
  const outputExtension = isWindows ? ".exe" : ".out";
  const outputFilename = `${outputId}${outputExtension}`;
  const outPath = path.join(outputPath, outputFilename);

  return new Promise((resolve, reject) => {
    const compileCommand = isWindows
      ? `gcc "${filePath}" -o "${outPath}"`
      : `gcc "${filePath}" -o "${outPath}"`;

    // Compile first
    exec(compileCommand, (compileError, _, compileStderr) => {
      if (compileError) {
        reject({ error: compileError, stderr: compileStderr });
        return;
      }

      // Run the executable with resource limits
      const runCommand = isWindows ? outputFilename : `./${outputFilename}`;
      const runOptions = { cwd: outputPath };

      executeWithLimits(runCommand, [], runOptions, input)
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
};

// New function for in-memory execution (serverless)
const executeCVirtual = async (virtualFile, input = "") => {
  console.log("[C Runner] Virtual execution for:", virtualFile.fileName);

  // For C, we need to write to temporary files for compilation
  const tmpDir = "/tmp";
  const tmpFilePath = path.join(tmpDir, virtualFile.fileName);
  const outputId = virtualFile.fileId;
  const outputFilename = `${outputId}.out`;
  const outPath = path.join(tmpDir, outputFilename);

  try {
    // Write code to temporary file
    fs.writeFileSync(tmpFilePath, virtualFile.content);
    console.log("[C Runner] Wrote code to temporary file:", tmpFilePath);

    return new Promise((resolve, reject) => {
      const compileCommand = `gcc "${tmpFilePath}" -o "${outPath}"`;

      // Compile first
      exec(compileCommand, (compileError, _, compileStderr) => {
        if (compileError) {
          reject({ error: compileError, stderr: compileStderr });
          return;
        }

        // Run the executable with resource limits
        const runCommand = `./${outputFilename}`;
        const runOptions = { cwd: tmpDir };

        executeWithLimits(runCommand, [], runOptions, input)
          .then((result) => {
            resolve(result);
          })
          .catch((error) => {
            reject(error);
          })
          .finally(() => {
            // Clean up temporary files
            try {
              if (fs.existsSync(tmpFilePath)) fs.unlinkSync(tmpFilePath);
              if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
            } catch (cleanupError) {
              console.log("[C Runner] Cleanup error:", cleanupError);
            }
          });
      });
    });
  } catch (error) {
    console.log("[C Runner] Error in virtual execution:", error);
    throw error;
  }
};

module.exports = { executeC };
