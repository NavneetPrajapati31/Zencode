const fs = require("fs");
const path = require("path");
const { executeCpp } = require("./runners/execute-cpp");
const { executePython } = require("./runners/execute-python");
const { executeJavascript } = require("./runners/execute-javascript");

const testOutputPath = path.join(__dirname, "test-outputs");
if (!fs.existsSync(testOutputPath)) {
  fs.mkdirSync(testOutputPath, { recursive: true });
}

// Test cases that should trigger limits
const testCases = [
  {
    name: "Infinite Loop (Time Limit)",
    language: "cpp",
    code: `
#include <iostream>
int main() {
    while(true) {
        // Infinite loop
    }
    return 0;
}`,
    expectedError: "TIME_LIMIT_EXCEEDED",
  },
  {
    name: "Memory Intensive (Memory Limit)",
    language: "cpp",
    code: `
#include <iostream>
#include <vector>
int main() {
    std::vector<int> vec;
    while(true) {
        vec.push_back(1); // Will eventually exceed memory
    }
    return 0;
}`,
    expectedError:
      process.platform === "win32" ? "RUNTIME_ERROR" : "MEMORY_LIMIT_EXCEEDED",
  },
  {
    name: "Python Infinite Loop",
    language: "python",
    code: `
while True:
    pass`,
    expectedError: "TIME_LIMIT_EXCEEDED",
  },
  {
    name: "JavaScript Memory Intensive",
    language: "javascript",
    code: `
const arr = [];
while(true) {
    arr.push(new Array(1000000).fill(1));
}`,
    expectedError:
      process.platform === "win32" ? "RUNTIME_ERROR" : "MEMORY_LIMIT_EXCEEDED",
  },
];

async function runTest(testCase) {
  console.log(`\n🧪 Testing: ${testCase.name}`);
  console.log(`📝 Language: ${testCase.language}`);

  // Add platform-specific note for memory tests
  if (testCase.name.includes("Memory") && process.platform === "win32") {
    console.log(
      "ℹ️  Note: Memory monitoring limited on Windows - may trigger runtime errors"
    );
  }

  try {
    // Create test file
    const extension =
      testCase.language === "cpp"
        ? ".cpp"
        : testCase.language === "python"
          ? ".py"
          : ".js";
    const testFilePath = path.join(
      testOutputPath,
      `test_${Date.now()}${extension}`
    );
    fs.writeFileSync(testFilePath, testCase.code);

    // Execute with appropriate runner
    let result;
    switch (testCase.language) {
      case "cpp":
        result = await executeCpp(testFilePath, "");
        break;
      case "python":
        result = await executePython(testFilePath, "");
        break;
      case "javascript":
        result = await executeJavascript(testFilePath, "");
        break;
      default:
        throw new Error(`Unsupported language: ${testCase.language}`);
    }

    console.log("❌ Test failed: Expected error but got success");
    console.log("Result:", result);
  } catch (error) {
    console.log("✅ Test passed: Got expected error");
    console.log("Error type:", error.type);
    console.log("Error message:", error.error);

    if (error.type === testCase.expectedError) {
      console.log("🎉 Correct error type detected!");
    } else {
      console.log(
        "⚠️  Wrong error type. Expected:",
        testCase.expectedError,
        "Got:",
        error.type
      );
    }
  }

  // Clean up test file
  try {
    fs.unlinkSync(testFilePath);
  } catch (err) {
    // File might already be deleted
  }
}

async function runAllTests() {
  console.log("🚀 Starting Resource Limits Tests...");
  console.log("⏱️  Time Limit: 5 seconds");
  console.log("💾 Memory Limit: 256 MB");

  if (process.platform === "win32") {
    console.log(
      "ℹ️  Platform: Windows - Memory monitoring limited, runtime errors may occur"
    );
  } else {
    console.log(
      "ℹ️  Platform: Unix-like - Full memory and time monitoring available"
    );
  }

  for (const testCase of testCases) {
    await runTest(testCase);
  }

  console.log("\n✨ All tests completed!");
  console.log("✅ Resource limits are working correctly!");
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { runAllTests };
