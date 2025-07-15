const { exec } = require("child_process");

const executePython = async (filePath) => {
  return new Promise((resolve, reject) => {
    const pythonCmd = process.platform === "win32" ? "python" : "python3";
    const runCommand = `${pythonCmd} "${filePath}"`;
    exec(runCommand, (error, stdout, stderr) => {
      if (error) {
        reject({ error, stderr });
        return;
      }
      resolve({ stdout, stderr });
    });
  });
};

module.exports = { executePython };
