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

app.post("/compiler", async (req, res) => {
  const { language = "cpp", code } = req.body;

  if (code === undefined) {
    return res.status(400).json({
      success: false,
      error: "Empty code body",
    });
  }

  const runner = runners[language.toLowerCase()];
  if (!runner) {
    return res.status(400).json({
      success: false,
      error: `Language '${language}' is not supported.`,
    });
  }

  try {
    const filePath = generateFile(language, code);
    const output = await runner(filePath);
    res.json({ filePath, output });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
  console.log(process.env.TEST_ENV);
});
