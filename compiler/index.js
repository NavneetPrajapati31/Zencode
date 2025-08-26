const express = require("express");
const cors = require("cors");
const app = express();
const generateFile = require("./generateFile");
const { executeC } = require("./runners/execute-c");
const { executeCpp } = require("./runners/execute-cpp");
const { executeJava } = require("./runners/execute-java");
const { executePython } = require("./runners/execute-python");
const { executeJavascript } = require("./runners/execute-javascript");
const { checkResourceLimits } = require("./utils/check-limits");
const dotenv = require("dotenv");
const generateAiResponse = require("./generateAiResponse");
dotenv.config();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Online Judge API" });
});

const runners = {
  c: executeC,
  cpp: executeCpp,
  java: executeJava,
  python: executePython,
  javascript: executeJavascript,
  js: executeJavascript,
};

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

app.post("/compiler", async (req, res) => {
  const {
    language = "cpp",
    code,
    input = "",
    problemId,
    harness = "",
  } = req.body;

  console.log("[Compiler] Received problemId:", problemId);
  console.log("[Compiler] Received code:\n", code);
  console.log("[Compiler] Received harness:\n", harness);

  if (code === undefined) {
    console.error("[Compiler] Error: Empty code body");
    return res.status(400).json({
      success: false,
      error: "Empty code body",
    });
  }

  const runner = runners[language.toLowerCase()];
  if (!runner) {
    console.error(`[Compiler] Error: Language '${language}' is not supported.`);
    return res.status(400).json({
      success: false,
      error: `Language '${language}' is not supported.`,
    });
  }

  let finalCode = code;

  // Use harness from frontend if provided
  if (harness && harness.trim()) {
    console.log("[Compiler] Using harness from frontend");
    let userCodeWithBoilerplate = code;
    if (language.toLowerCase() === "python" && problemId) {
      try {
        const resp = await fetch(`${BACKEND_URL}/api/problems/${problemId}`);
        if (resp.ok) {
          const problem = await resp.json();
          if (problem.boilerplate && problem.boilerplate.python) {
            const funcNameMatch =
              problem.boilerplate.python.match(/def\s+(\w+)\s*\(/);
            if (funcNameMatch) {
              const funcName = funcNameMatch[1];
              const userDefinesFunc = new RegExp(
                `def\\s+${funcName}\\s*\\(`
              ).test(code);
              if (!userDefinesFunc) {
                userCodeWithBoilerplate =
                  problem.boilerplate.python + "\n" + code;
              }
            }
          }
        } else {
          userCodeWithBoilerplate = code;
        }
      } catch (err) {
        console.error(
          "[Compiler] Error fetching problem for boilerplate:",
          err
        );
        userCodeWithBoilerplate = code;
      }
    }
    console.log(
      "[Compiler] User code with boilerplate (before harness replace):\n",
      userCodeWithBoilerplate
    );
    // Insert user code into harness, supporting both // USER_CODE and # USER_CODE
    if (harness.includes("// USER_CODE")) {
      finalCode = harness.replace("// USER_CODE", userCodeWithBoilerplate);
    } else if (harness.includes("# USER_CODE")) {
      finalCode = harness.replace("# USER_CODE", userCodeWithBoilerplate);
    } else {
      // fallback: prepend user code
      finalCode = userCodeWithBoilerplate + "\n" + harness;
    }
  } else if (problemId) {
    // Fallback to fetching from backend
    try {
      const resp = await fetch(`${BACKEND_URL}/api/problems/${problemId}`);
      if (resp.ok) {
        const problem = await resp.json();
        console.log("[Compiler] Fetched problem:", problem);
        let userCode = code;
        if (
          language.toLowerCase() === "python" &&
          problem.boilerplate &&
          problem.boilerplate.python
        ) {
          const funcNameMatch =
            problem.boilerplate.python.match(/def\s+(\w+)\s*\(/);
          if (funcNameMatch) {
            const funcName = funcNameMatch[1];
            const userDefinesFunc = new RegExp(
              `def\\s+${funcName}\\s*\\(`
            ).test(code);
            if (!userDefinesFunc) {
              userCode = problem.boilerplate.python + "\n" + code;
            }
          }
        }
        console.log(
          "[Compiler] User code with boilerplate (before harness replace):\n",
          userCode
        );
        if (problem.harness && problem.harness[language]) {
          finalCode = problem.harness[language].replace(
            "// USER_CODE",
            userCode
          );
        }
      } else {
        console.error(`[Compiler] Error fetching problem: HTTP ${resp.status}`);
      }
    } catch (err) {
      console.error("[Compiler] Error fetching problem:", err);
    }
  }

  console.log("[Compiler] Final code to compile:\n", finalCode);

  try {
    const fileObj = generateFile(language, finalCode);
    const output = await runner(fileObj, input);

    // Handle both virtual and real file paths in response
    const responseData = {
      filePath: fileObj.isVirtual ? fileObj.filePath : fileObj.filePath,
      output,
      isVirtual: fileObj.isVirtual || false,
    };

    res.json(responseData);
  } catch (error) {
    console.error("[Compiler] Compilation/Execution error:", error);

    // Handle different types of errors with appropriate status codes
    let statusCode = 500;
    let errorMessage = error.error || error.message || "Unknown error";

    if (error.type === "TIME_LIMIT_EXCEEDED") {
      statusCode = 408; // Request Timeout
      errorMessage = `Time limit exceeded (5 seconds)`;
    } else if (error.type === "MEMORY_LIMIT_EXCEEDED") {
      statusCode = 413; // Payload Too Large
      errorMessage = `Memory limit exceeded (256 MB)`;
    } else if (error.type === "RUNTIME_ERROR") {
      statusCode = 500; // Internal Server Error
    } else if (error.type === "PROCESS_ERROR") {
      statusCode = 500; // Internal Server Error
    } else if (error.type === "COMPILER_NOT_AVAILABLE") {
      statusCode = 503; // Service Unavailable
      errorMessage =
        error.error.message || "Compiler not available in this environment";
    } else if (error.type === "COMPILATION_ERROR") {
      statusCode = 400; // Bad Request
      errorMessage = `Compilation failed: ${error.stderr || errorMessage}`;
    }

    res.status(statusCode).json({
      success: false,
      error: errorMessage,
      stderr: error.stderr || "",
      type: error.type || "UNKNOWN_ERROR",
      suggestion:
        error.type === "COMPILER_NOT_AVAILABLE"
          ? "Try using Python or JavaScript instead, which are available in serverless environments."
          : undefined,
    });
  }
});

app.post("/ai-review", async (req, res) => {
  const { code } = req.body;
  if (code === undefined) {
    console.error("[AI-REVIEW] Error: Empty code body");
    return res.status(400).json({
      success: false,
      error: "Empty code body",
    });
  }

  try {
    const aiResponse = await generateAiResponse(code);
    res.json({ success: true, aiResponse });
  } catch (error) {
    console.error("Error executing code:", error.message);
  }
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server is running on port 8000");
  console.log(process.env.TEST_ENV);
  console.log(process.env.BACKEND_URL);
  console.log(process.env.MONGODB_URI);

  // Display resource limits configuration on startup
  console.log("\n" + "=".repeat(50));
  checkResourceLimits();
  console.log("=".repeat(50) + "\n");
});
