const express = require("express");
const cors = require("cors");
const app = express();
const generateFile = require("./generateFile");
const { executeC } = require("./runners/execute-c");
const { executeCpp } = require("./runners/execute-cpp");
const { executeJava } = require("./runners/execute-java");
const { executePython } = require("./runners/execute-python");
const { executeJavascript } = require("./runners/execute-javascript");
const dotenv = require("dotenv");
const generateAiResponse = require("./generateAiResponse");
dotenv.config();

app.use(cors());
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

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

app.post("/compiler", async (req, res) => {
  const { language = "cpp", code, input = "", problemId } = req.body;

  console.log("[Compiler] Received problemId:", problemId);

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
  if (problemId) {
    try {
      const resp = await fetch(`${BACKEND_URL}/api/problems/${problemId}`);
      if (resp.ok) {
        const problem = await resp.json();
        console.log("[Compiler] Fetched problem:", problem);
        if (problem.harness && problem.harness[language]) {
          finalCode = problem.harness[language].replace("// USER_CODE", code);
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
    const filePath = generateFile(language, finalCode);
    const output = await runner(filePath, input);
    res.json({ filePath, output });
  } catch (error) {
    console.error("[Compiler] Compilation/Execution error:", error);
    res.status(500).json({ success: false, error });
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

app.listen(8000, () => {
  console.log("Server is running on port 8000");
  console.log(process.env.TEST_ENV);
  console.log(process.env.BACKEND_URL);
  console.log(process.env.MONGODB_URI);
});
