const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { executeWithLimits } = require("../utils/resource-limits");

const outputPath = path.join(__dirname, "../outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

// Check if C++ compiler is available
const checkCompilerAvailability = () => {
  return new Promise((resolve) => {
    exec("which g++", (error) => {
      if (error) {
        console.log("[C++ Runner] g++ not found, checking alternatives...");
        // Check for other C++ compilers
        exec("which clang++", (clangError) => {
          if (clangError) {
            console.log("[C++ Runner] No C++ compiler found");
            resolve({ available: false, compiler: null });
          } else {
            console.log("[C++ Runner] clang++ found");
            resolve({ available: true, compiler: "clang++" });
          }
        });
      } else {
        console.log("[C++ Runner] g++ found");
        resolve({ available: true, compiler: "g++" });
      }
    });
  });
};

const executeCpp = async (filePath, input = "") => {
  console.log("[C++ Runner] Starting execution");
  console.log("[C++ Runner] Input file path:", filePath);
  console.log("[C++ Runner] Input:", input);

  // Check if this is a virtual file (in-memory compilation)
  const isVirtual = typeof filePath === "object" && filePath.isVirtual;

  if (isVirtual) {
    console.log(
      "[C++ Runner] Using in-memory compilation for serverless environment"
    );
    return executeCppVirtual(filePath, input);
  }

  // Original file-based execution logic
  const outputId = path.basename(filePath).split(".")[0];
  const isWindows = process.platform === "win32";
  const outputExtension = isWindows ? ".exe" : ".out";
  const outputFilename = `${outputId}${outputExtension}`;
  const outPath = path.join(outputPath, outputFilename);

  console.log("[C++ Runner] Output path:", outPath);
  console.log("[C++ Runner] Working directory:", process.cwd());

  return new Promise((resolve, reject) => {
    const compileCommand = isWindows
      ? `g++ "${filePath}" -o "${outPath}"`
      : `g++ "${filePath}" -o "${outPath}"`;

    console.log("[C++ Runner] Compile command:", compileCommand);

    // Compile first
    exec(compileCommand, (compileError, compileStdout, compileStderr) => {
      console.log("[C++ Runner] Compilation result:");
      console.log("[C++ Runner] - Error:", compileError);
      console.log("[C++ Runner] - Stdout:", compileStdout);
      console.log("[C++ Runner] - Stderr:", compileStderr);

      if (compileError) {
        console.log("[C++ Runner] Compilation failed");
        reject({ error: compileError, stderr: compileStderr });
        return;
      }

      console.log(
        "[C++ Runner] Compilation successful, checking if executable exists"
      );
      if (!fs.existsSync(outPath)) {
        console.log("[C++ Runner] Executable not found at:", outPath);
        reject({ error: "Executable not found after compilation", stderr: "" });
        return;
      }

      console.log(
        "[C++ Runner] Executable found, running with resource limits"
      );

      // Run the executable with resource limits
      executeWithLimits(outPath, [], { cwd: process.cwd() }, input)
        .then((result) => {
          console.log("[C++ Runner] Execution completed successfully");
          resolve(result);
        })
        .catch((error) => {
          console.log("[C++ Runner] Execution failed:", error);
          reject(error);
        });
    });
  });
};

// New function for in-memory execution (serverless)
const executeCppVirtual = async (virtualFile, input = "") => {
  console.log("[C++ Runner] Virtual execution for:", virtualFile.fileName);

  // Check compiler availability first
  const compilerCheck = await checkCompilerAvailability();

  if (!compilerCheck.available) {
    const errorMessage =
      "C++ compiler (g++ or clang++) not available in this environment. " +
      "This is a limitation of the serverless environment. " +
      "Consider using interpreted languages like Python or JavaScript instead.";

    console.log("[C++ Runner] Compiler not available:", errorMessage);
    throw {
      error: new Error(errorMessage),
      stderr: "No C++ compiler available",
      type: "COMPILER_NOT_AVAILABLE",
    };
  }

  // For serverless, we'll need to use a different approach
  // Since we can't compile C++ without writing to disk, we'll use /tmp directory
  const tmpDir = "/tmp";
  const tmpFilePath = path.join(tmpDir, virtualFile.fileName);
  const outputId = virtualFile.fileId;
  const outputFilename = `${outputId}.out`;
  const outPath = path.join(tmpDir, outputFilename);

  try {
    // Write code to temporary file
    fs.writeFileSync(tmpFilePath, virtualFile.content);
    console.log("[C++ Runner] Wrote code to temporary file:", tmpFilePath);

    return new Promise((resolve, reject) => {
      const compileCommand = `${compilerCheck.compiler} "${tmpFilePath}" -o "${outPath}"`;
      console.log("[C++ Runner] Compile command:", compileCommand);

      // Compile first
      exec(compileCommand, (compileError, compileStdout, compileStderr) => {
        if (compileError) {
          console.log("[C++ Runner] Compilation failed");
          reject({
            error: compileError,
            stderr: compileStderr,
            type: "COMPILATION_ERROR",
          });
          return;
        }

        console.log("[C++ Runner] Compilation successful");

        // Run the executable with resource limits
        executeWithLimits(outPath, [], { cwd: tmpDir }, input)
          .then((result) => {
            console.log(
              "[C++ Runner] Virtual execution completed successfully"
            );
            resolve(result);
          })
          .catch((error) => {
            console.log("[C++ Runner] Virtual execution failed:", error);
            reject(error);
          })
          .finally(() => {
            // Clean up temporary files
            try {
              if (fs.existsSync(tmpFilePath)) fs.unlinkSync(tmpFilePath);
              if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
            } catch (cleanupError) {
              console.log("[C++ Runner] Cleanup error:", cleanupError);
            }
          });
      });
    });
  } catch (error) {
    console.log("[C++ Runner] Error in virtual execution:", error);
    throw error;
  }
};

module.exports = { executeCpp };
