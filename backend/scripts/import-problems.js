const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// Import models
const Problem = require("../models/Problem");
const TestCase = require("../models/TestCase");

// Database connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/";
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    // console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

// Transform old problem structure to new structure
const transformProblem = (oldProblem) => {
  // Combine title and description for statement
  const statement = `${oldProblem.title}\n\n${oldProblem.description}`;

  // Use title as name
  const name = oldProblem.title;

  // Create a simple code template using the first available boilerplate
  let code = "";
  if (oldProblem.boilerplate) {
    if (oldProblem.boilerplate.python) {
      code = oldProblem.boilerplate.python;
    } else if (oldProblem.boilerplate.javascript) {
      code = oldProblem.boilerplate.javascript;
    } else if (oldProblem.boilerplate.cpp) {
      code = oldProblem.boilerplate.cpp;
    } else if (oldProblem.boilerplate.java) {
      code = oldProblem.boilerplate.java;
    } else if (oldProblem.boilerplate.c) {
      code = oldProblem.boilerplate.c;
    }
  }

  return {
    statement,
    name,
    code,
    difficulty: oldProblem.difficulty || "Medium",
  };
};

// Transform test cases
const transformTestCases = (oldProblem, problemId) => {
  const testCases = [];

  // Add regular test cases
  if (oldProblem.testcases) {
    oldProblem.testcases.forEach((testCase, index) => {
      testCases.push({
        input: testCase.input,
        output: testCase.output,
        problem: problemId,
      });
    });
  }

  // Add hidden test cases
  if (oldProblem.hiddenTestcases) {
    oldProblem.hiddenTestcases.forEach((testCase, index) => {
      testCases.push({
        input: testCase.input,
        output: testCase.output,
        problem: problemId,
      });
    });
  }

  return testCases;
};

// Import problems
const importProblems = async () => {
  try {
    // Read the JSON file
    const jsonPath = path.join(__dirname, "../../online-judge.problems.json");
    const problemsData = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

    // console.log(`📁 Found ${problemsData.length} problems to import`);

    // Clear existing data (optional - comment out if you want to keep existing data)
    // console.log("🗑️ Clearing existing problems and test cases...");
    await Problem.deleteMany({});
    await TestCase.deleteMany({});

    let importedProblems = 0;
    let importedTestCases = 0;

    // Import each problem
    for (const oldProblem of problemsData) {
      try {
        // Transform and create problem
        const problemData = transformProblem(oldProblem);
        const problem = new Problem(problemData);
        const savedProblem = await problem.save();

        // console.log(`✅ Imported problem: ${problemData.name}`);
        importedProblems++;

        // Transform and create test cases
        const testCasesData = transformTestCases(oldProblem, savedProblem._id);
        if (testCasesData.length > 0) {
          await TestCase.insertMany(testCasesData);
          importedTestCases += testCasesData.length;
          // console.log(`   📝 Added ${testCasesData.length} test cases`);
        }
      } catch (error) {
        console.error(
          `❌ Error importing problem "${oldProblem.title}":`,
          error.message
        );
      }
    }

    // console.log("\n🎉 Import completed!");
    // console.log(`📊 Statistics:`);
    // console.log(`   - Problems imported: ${importedProblems}`);
    // console.log(`   - Test cases imported: ${importedTestCases}`);

    // Display some sample data
    const sampleProblems = await Problem.find().limit(3);
    // console.log("\n📋 Sample imported problems:");
    sampleProblems.forEach((problem, index) => {
      // console.log(`   ${index + 1}. ${problem.name} (${problem.difficulty})`);
    });
  } catch (error) {
    console.error("❌ Import failed:", error.message);
  } finally {
    await mongoose.connection.close();
    // console.log("🔌 Database connection closed");
  }
};

// Run the import
const runImport = async () => {
  await connectDB();
  await importProblems();
};

// Run if this file is executed directly
if (require.main === module) {
  runImport().catch(console.error);
}

module.exports = { runImport };
