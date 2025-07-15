const { exec } = require("child_process");

const executeJava = async (filePath) => {
  return new Promise((resolve, reject) => {
    const runCommand = `java "${filePath}"`;
    exec(runCommand, (error, stdout, stderr) => {
      if (error) {
        reject({ error, stderr });
        return;
      }
      resolve({ stdout, stderr });
    });
  });
};

module.exports = { executeJava };
