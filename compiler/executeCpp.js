const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { stderr } = require("process");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = async (filePath) => {
  const outputId = path.basename(filePath).split(".")[0];
  const outputFilename = `${outputId}.exe`;
  const outPath = path.join(outputPath, outputFilename);

  return new Promise((resolve, reject) => {
    const isWindows = process.platform === "win32";
    const runCommand = isWindows
      ? `g++ "${filePath}" -o "${outPath}" && cd "${outputPath}" && ${outputFilename}`
      : `g++ "${filePath}" -o "${outPath}" && cd "${outputPath}" && ./${outputFilename}`;
    exec(runCommand, (error, stdout, stderr) => {
      if (error) {
        reject({ error, stderr });
        return;
      }
      resolve({ stdout, stderr });
    });
  });
};

module.exports = executeCpp;
