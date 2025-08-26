const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const { executeWithLimits } = require("../utils/resource-limits");

const executeJava = (filePath, input = "") => {
  // Check if this is a virtual file (in-memory compilation)
  const isVirtual = typeof filePath === "object" && filePath.isVirtual;

  if (isVirtual) {
    console.log(
      "[Java Runner] Using in-memory execution for serverless environment"
    );
    return executeJavaVirtual(filePath, input);
  }

  // Original file-based execution logic
  // Extract the directory path and the filename (without extension)
  const dirPath = path.dirname(filePath);
  const fileName = path.basename(filePath, ".java");

  return new Promise((resolve, reject) => {
    // 1. Compile the .java file. The -d flag places the .class file in the same directory.
    const compiler = spawn("javac", [filePath, "-d", dirPath]);
    let compileStderr = "";

    compiler.stderr.on("data", (data) => {
      compileStderr += data;
    });

    compiler.on("close", (code) => {
      // If compilation fails, reject with the compiler error
      if (code !== 0) {
        reject({
          error: `Compilation failed with code ${code}`,
          stderr: compileStderr,
        });
        return;
      }

      // 2. If compilation is successful, run the compiled .class file with resource limits.
      // We know the main class is named "Main" from our harness.
      // The -cp flag sets the classpath to the directory containing our .class files.
      executeWithLimits("java", ["-cp", dirPath, "Main"], {}, input)
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          reject(error);
        });
    });
    compiler.on("error", (err) => {
      reject({ error: err, stderr: compileStderr });
    });
  });
};

// New function for in-memory execution (serverless)
const executeJavaVirtual = (virtualFile, input = "") => {
  console.log("[Java Runner] Virtual execution for:", virtualFile.fileName);

  // For Java, we need to write to temporary files for compilation
  const tmpDir = "/tmp";
  const tmpFilePath = path.join(tmpDir, virtualFile.fileName);

  try {
    // Write code to temporary file
    fs.writeFileSync(tmpFilePath, virtualFile.content);
    console.log("[Java Runner] Wrote code to temporary file:", tmpFilePath);

    return new Promise((resolve, reject) => {
      // 1. Compile the .java file
      const compiler = spawn("javac", [tmpFilePath, "-d", tmpDir]);
      let compileStderr = "";

      compiler.stderr.on("data", (data) => {
        compileStderr += data;
      });

      compiler.on("close", (code) => {
        // If compilation fails, reject with the compiler error
        if (code !== 0) {
          reject({
            error: `Compilation failed with code ${code}`,
            stderr: compileStderr,
          });
          return;
        }

        // 2. If compilation is successful, run the compiled .class file
        executeWithLimits(
          "java",
          ["-cp", tmpDir, "Main"],
          { cwd: tmpDir },
          input
        )
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
              // Clean up .class files
              const className = path.basename(virtualFile.fileName, ".java");
              const classFile = path.join(tmpDir, `${className}.class`);
              if (fs.existsSync(classFile)) fs.unlinkSync(classFile);
            } catch (cleanupError) {
              console.log("[Java Runner] Cleanup error:", cleanupError);
            }
          });
      });
      compiler.on("error", (err) => {
        reject({ error: err, stderr: compileStderr });
      });
    });
  } catch (error) {
    console.log("[Java Runner] Error in virtual execution:", error);
    throw error;
  }
};

module.exports = { executeJava };
