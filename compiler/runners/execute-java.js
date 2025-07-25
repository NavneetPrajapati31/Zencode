const { spawn } = require("child_process");
const path = require("path");

const executeJava = (filePath, input = "") => {
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

      // 2. If compilation is successful, run the compiled .class file.
      // We know the main class is named "Main" from our harness.
      // The -cp flag sets the classpath to the directory containing our .class files.
      const runner = spawn("java", ["-cp", dirPath, "Main"]);
      let stdout = "";
      let stderr = "";

      // Provide input to the running program
      runner.stdin.write(input);
      runner.stdin.end();

      runner.stdout.on("data", (data) => {
        stdout += data;
      });

      runner.stderr.on("data", (data) => {
        stderr += data;
      });

      runner.on("close", (code) => {
        if (code !== 0) {
          reject({ error: `Process exited with code ${code}`, stderr });
        } else {
          resolve({ stdout, stderr });
        }
      });
      runner.on("error", (err) => {
        reject({ error: err, stderr });
      });
    });
    compiler.on("error", (err) => {
      reject({ error: err, stderr: compileStderr });
    });
  });
};

module.exports = { executeJava };
