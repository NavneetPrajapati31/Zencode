const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

// For serverless environments, we'll use in-memory compilation
// But keep file-based approach as fallback for local development
const isServerless =
  process.env.VERCEL ||
  process.env.NODE_ENV === "production" ||
  process.env.AWS_LAMBDA_FUNCTION_NAME ||
  process.env.FUNCTIONS_WORKER_RUNTIME ||
  process.env.KUBERNETES_SERVICE_HOST;

const dirCodes = path.join(__dirname, "codes");

// Only create directory if not in serverless mode
if (!isServerless && !fs.existsSync(dirCodes)) {
  fs.mkdirSync(dirCodes, { recursive: true });
}

const generateFile = (language, code) => {
  const fileId = uuid();
  const fileName = `${fileId}.${language}`;

  if (isServerless) {
    // In serverless mode, return a virtual file object
    return {
      fileId,
      fileName,
      code,
      isVirtual: true,
      // For compatibility with existing runners
      filePath: `/tmp/${fileName}`,
      // Store code in memory
      content: code,
    };
  } else {
    // Local development mode - write to disk
    const filePath = path.join(dirCodes, fileName);
    fs.writeFileSync(filePath, code);
    return {
      fileId,
      fileName,
      filePath,
      isVirtual: false,
      content: code,
    };
  }
};

module.exports = generateFile;
