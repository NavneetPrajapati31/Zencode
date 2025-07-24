const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { spawn } = require("child_process");

const outputPath = path.join(__dirname, "../outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = async (filePath, input = "") => {
  console.log("[C++ Runner] Starting execution");
  console.log("[C++ Runner] Input file path:", filePath);
  console.log("[C++ Runner] Input:", input);

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

      console.log("[C++ Runner] Executable found, running with input:", input);

      // Run the executable with full path
      const child = spawn(outPath, [], {
        cwd: process.cwd(), // Use current working directory
      });

      let stdout = "";
      let stderr = "";

      child.stdin.write(input);
      child.stdin.end();

      child.stdout.on("data", (data) => {
        console.log("[C++ Runner] Stdout data:", data.toString());
        stdout += data;
      });

      child.stderr.on("data", (data) => {
        console.log("[C++ Runner] Stderr data:", data.toString());
        stderr += data;
      });

      child.on("close", (code) => {
        console.log("[C++ Runner] Process closed with code:", code);
        if (code !== 0) {
          reject({ error: `Process exited with code ${code}`, stderr });
        } else {
          resolve({ stdout, stderr });
        }
      });

      child.on("error", (err) => {
        console.log("[C++ Runner] Process error:", err);
        reject({ error: err, stderr });
      });
    });
  });
};

module.exports = { executeCpp };
