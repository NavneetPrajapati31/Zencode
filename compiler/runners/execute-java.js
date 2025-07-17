const { spawn } = require("child_process");

const executeJava = async (filePath, input = "") => {
  return new Promise((resolve, reject) => {
    const child = spawn("java", [filePath]);
    let stdout = "";
    let stderr = "";
    child.stdin.write(input);
    child.stdin.end();
    child.stdout.on("data", (data) => {
      stdout += data;
    });
    child.stderr.on("data", (data) => {
      stderr += data;
    });
    child.on("close", (code) => {
      if (code !== 0) {
        reject({ error: `Process exited with code ${code}`, stderr });
      } else {
        resolve({ stdout, stderr });
      }
    });
    child.on("error", (err) => {
      reject({ error: err, stderr });
    });
  });
};

module.exports = { executeJava };
