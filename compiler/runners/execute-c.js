const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { executeWithLimits } = require("../utils/resource-limits");

const outputPath = path.join(__dirname, "../outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeC = async (filePath, input = "") => {
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

module.exports = { executeC };
