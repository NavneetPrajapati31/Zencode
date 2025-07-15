const { exec } = require("child_process");

const executeJavascript = async (filePath) => {
  return new Promise((resolve, reject) => {
    const runCommand = `node "${filePath}"`;
    exec(runCommand, (error, stdout, stderr) => {
      if (error) {
        reject({ error, stderr });
        return;
      }
      resolve({ stdout, stderr });
    });
  });
};

module.exports = { executeJavascript };
