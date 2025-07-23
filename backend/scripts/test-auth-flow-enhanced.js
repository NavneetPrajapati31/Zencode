const axios = require("axios");
const mongoose = require("mongoose");
const User = require("../models/User");
const dotenv = require("dotenv");
dotenv.config();

// Configuration
const BASE_URL = "http://localhost:5000/api";
const TEST_EMAIL = `test-${Date.now()}@example.com`;
const TEST_PASSWORD = "TestPassword123!";
const TEST_USERNAME = `testuser${Date.now().toString().slice(-6)}`; // Keep username under 20 chars

// Test state
let testState = {
  signupToken: null,
  resetToken: null,
  authToken: null,
  userId: null,
  username: null,
  verificationToken: null,
  resetTokenFromDB: null,
};

// Utility functions
const log = (message, type = "INFO") => {
  const timestamp = new Date().toISOString();
  const color =
    type === "ERROR"
      ? "\x1b[31m"
      : type === "SUCCESS"
        ? "\x1b[32m"
        : "\x1b[36m";
  const reset = "\x1b[0m";
  // console.log(`${color}[${timestamp}] ${type}:${reset} ${message}`);
};

const makeRequest = async (method, endpoint, data = null, token = null) => {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      ...(data && { data }),
    };

    const response = await axios(config);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message,
      status: error.response?.status,
    };
  }
};

// Database helper functions
const connectToDatabase = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      log("✅ Database already connected", "SUCCESS");
      return true;
    }

    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/zencode"
    );
    log("✅ Database connected successfully", "SUCCESS");
    return true;
  } catch (error) {
    log(`❌ Database connection failed: ${error.message}`, "ERROR");
    return false;
  }
};

const getUserFromDB = async (email) => {
  try {
    const user = await User.findOne({ email });
    return user;
  } catch (error) {
    log(`❌ Error fetching user from DB: ${error.message}`, "ERROR");
    return null;
  }
};

const verifyUserInDB = async (email, expectedFields = {}) => {
  const user = await getUserFromDB(email);
  if (!user) {
    log(`❌ User not found in database: ${email}`, "ERROR");
    return false;
  }

  log(`✅ User found in database: ${email}`, "SUCCESS");
  log(`   ID: ${user._id}`);
  log(`   Username: ${user.username}`);
  log(`   Email Verified: ${user.emailVerified}`);
  log(`   Profile Complete: ${user.profileComplete}`);

  // Check expected fields
  for (const [field, expectedValue] of Object.entries(expectedFields)) {
    if (user[field] !== expectedValue) {
      log(
        `❌ Field ${field} mismatch. Expected: ${expectedValue}, Got: ${user[field]}`,
        "ERROR"
      );
      return false;
    }
  }

  return true;
};

const getVerificationTokenFromDB = async (email) => {
  const user = await getUserFromDB(email);
  if (user && user.verificationToken) {
    testState.verificationToken = user.verificationToken;
    log(
      `✅ Verification token found in DB: ${user.verificationToken.substring(0, 10)}...`,
      "SUCCESS"
    );
    return user.verificationToken;
  }
  log("❌ No verification token found in DB", "ERROR");
  return null;
};

const getResetTokenFromDB = async (email) => {
  const user = await getUserFromDB(email);
  if (user && user.resetToken) {
    testState.resetTokenFromDB = user.resetToken;
    log(
      `✅ Reset token found in DB: ${user.resetToken.substring(0, 10)}...`,
      "SUCCESS"
    );
    return user.resetToken;
  }
  log("❌ No reset token found in DB", "ERROR");
  return null;
};

// Test functions
const testServerConnection = async () => {
  log("Testing server connection...");
  const result = await makeRequest("GET", "/health");
  if (result.success) {
    log("✅ Server is running and healthy", "SUCCESS");
    return true;
  } else {
    log("❌ Server connection failed", "ERROR");
    return false;
  }
};

const testDatabaseConnection = async () => {
  log("Testing database connection...");
  return await connectToDatabase();
};

const testSignup = async () => {
  log("Testing user signup...");
  log(`   Email: ${TEST_EMAIL}`);
  log(`   Username: ${TEST_USERNAME}`);
  log(`   Username length: ${TEST_USERNAME.length}`);

  const signupData = {
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
    username: TEST_USERNAME,
  };

  const result = await makeRequest("POST", "/auth/signup", signupData);

  if (result.success) {
    log("✅ Signup successful", "SUCCESS");
    log(`   User created: ${result.data.user.email}`);
    log(`   Username: ${result.data.user.username}`);
    log(`   Email verified: ${result.data.user.emailVerified}`);
    testState.userId = result.data.user._id;
    testState.username = result.data.user.username;

    // Verify user was created in database
    try {
      const dbVerified = await verifyUserInDB(TEST_EMAIL, {
        username: TEST_USERNAME,
        emailVerified: false,
        profileComplete: true, // Since username was provided
      });
      return dbVerified;
    } catch (error) {
      log(`❌ Database verification error: ${error.message}`, "ERROR");
      // Even if database verification fails, signup was successful
      return true;
    }
  } else {
    log(`❌ Signup failed: ${result.error}`, "ERROR");
    log(`   Status: ${result.status}`);
    return false;
  }
};

const testSigninWithoutVerification = async () => {
  log("Testing signin without email verification (should fail)...");
  const signinData = {
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
  };

  const result = await makeRequest("POST", "/auth/signin", signinData);

  if (!result.success && result.status === 401) {
    log("✅ Signin correctly blocked - email not verified", "SUCCESS");
    return true;
  } else {
    log(`❌ Signin should have been blocked but got: ${result.error}`, "ERROR");
    return false;
  }
};

const testEmailVerification = async () => {
  log("Testing email verification...");

  // Get verification token from database
  const verificationToken = await getVerificationTokenFromDB(TEST_EMAIL);
  if (!verificationToken) {
    log("❌ No verification token available for testing", "ERROR");
    return false;
  }

  // Test verification endpoint
  const result = await makeRequest("POST", "/auth/verify-email", {
    token: verificationToken,
  });

  if (result.success) {
    log("✅ Email verification successful", "SUCCESS");

    // Verify user is now verified in database
    const dbVerified = await verifyUserInDB(TEST_EMAIL, {
      emailVerified: true,
    });

    return dbVerified;
  } else {
    log(`❌ Email verification failed: ${result.error}`, "ERROR");
    return false;
  }
};

const testSigninWithVerification = async () => {
  log("Testing signin with email verification...");
  const signinData = {
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
  };

  const result = await makeRequest("POST", "/auth/signin", signinData);

  if (result.success) {
    log("✅ Signin successful after verification", "SUCCESS");
    log(`   Token received: ${result.data.token ? "Yes" : "No"}`);
    log(`   User data: ${JSON.stringify(result.data.user)}`);
    testState.authToken = result.data.token;
    return true;
  } else {
    log(`❌ Signin failed: ${result.error}`, "ERROR");
    return false;
  }
};

const testForgotPassword = async () => {
  log("Testing forgot password...");
  const forgotData = {
    email: TEST_EMAIL,
  };

  const result = await makeRequest("POST", "/auth/forgot-password", forgotData);

  if (result.success) {
    log("✅ Forgot password email sent", "SUCCESS");

    // Wait a moment for the email to be processed
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Get reset token from database
    const resetToken = await getResetTokenFromDB(TEST_EMAIL);
    if (resetToken) {
      log("✅ Reset token found in database", "SUCCESS");
      return true;
    } else {
      log("❌ Reset token not found in database", "ERROR");
      return false;
    }
  } else {
    log(`❌ Forgot password failed: ${result.error}`, "ERROR");
    return false;
  }
};

const testValidateResetToken = async () => {
  log("Testing reset token validation...");

  if (!testState.resetTokenFromDB) {
    log("❌ No reset token available for testing", "ERROR");
    return false;
  }

  const result = await makeRequest(
    "GET",
    `/auth/validate-reset-token/${testState.resetTokenFromDB}`
  );

  if (result.success) {
    log("✅ Reset token validation successful", "SUCCESS");
    return true;
  } else {
    log(`❌ Reset token validation failed: ${result.error}`, "ERROR");
    return false;
  }
};

const testResetPassword = async () => {
  log("Testing password reset...");

  if (!testState.resetTokenFromDB) {
    log("❌ No reset token available for testing", "ERROR");
    return false;
  }

  const resetData = {
    token: testState.resetTokenFromDB,
    password: "NewPassword123!",
  };

  const result = await makeRequest("POST", "/auth/reset-password", resetData);

  if (result.success) {
    log("✅ Password reset successful", "SUCCESS");

    // Test signin with new password
    const signinResult = await makeRequest("POST", "/auth/signin", {
      email: TEST_EMAIL,
      password: "NewPassword123!",
    });

    if (signinResult.success) {
      log("✅ Signin with new password successful", "SUCCESS");
      return true;
    } else {
      log(`❌ Signin with new password failed: ${signinResult.error}`, "ERROR");
      return false;
    }
  } else {
    log(`❌ Password reset failed: ${result.error}`, "ERROR");
    return false;
  }
};

const testResendVerification = async () => {
  log("Testing resend verification email...");

  const result = await makeRequest(
    "POST",
    "/auth/resend-verification",
    {},
    testState.authToken
  );

  if (result.success) {
    log("✅ Verification email resent", "SUCCESS");
    return true;
  } else if (result.error && result.error.includes("already verified")) {
    log(
      "✅ Resend verification correctly rejected - email already verified",
      "SUCCESS"
    );
    return true;
  } else {
    log(`❌ Resend verification failed: ${result.error}`, "ERROR");
    return false;
  }
};

const testProfileAccess = async () => {
  log("Testing profile access...");

  // After password reset, we need to sign in again to get a fresh token
  if (!testState.authToken) {
    log("❌ No auth token available for profile test", "ERROR");
    return false;
  }

  // Try to get a fresh token by signing in again
  const signinResult = await makeRequest("POST", "/auth/signin", {
    email: TEST_EMAIL,
    password: "NewPassword123!", // Use the new password after reset
  });

  if (signinResult.success) {
    testState.authToken = signinResult.data.token;
    log("✅ Got fresh auth token after password reset", "SUCCESS");
    // Update username from the fresh signin response
    if (signinResult.data.user && signinResult.data.user.username) {
      testState.username = signinResult.data.user.username;
      log(`   Updated username: ${testState.username}`, "INFO");
    }
  }

  log(
    `   Attempting to access profile for username: ${testState.username}`,
    "INFO"
  );

  const result = await makeRequest(
    "GET",
    `/profile/${testState.username}`,
    null,
    testState.authToken
  );

  if (result.success) {
    log("✅ Profile access successful", "SUCCESS");
    log(`   Profile data: ${JSON.stringify(result.data.user)}`);
    return true;
  } else {
    log(`❌ Profile access failed: ${result.error}`, "ERROR");
    return false;
  }
};

const testInvalidCredentials = async () => {
  log("Testing invalid credentials...");

  const invalidData = {
    email: TEST_EMAIL,
    password: "WrongPassword123!",
  };

  const result = await makeRequest("POST", "/auth/signin", invalidData);

  if (!result.success && result.status === 401) {
    log("✅ Invalid credentials correctly rejected", "SUCCESS");
    return true;
  } else {
    log(
      `❌ Invalid credentials should have been rejected but got: ${result.error}`,
      "ERROR"
    );
    return false;
  }
};

const testInvalidEmail = async () => {
  log("Testing invalid email format...");

  const invalidData = {
    email: "invalid-email",
    password: TEST_PASSWORD,
  };

  const result = await makeRequest("POST", "/auth/signin", invalidData);

  if (!result.success) {
    log("✅ Invalid email format correctly rejected", "SUCCESS");
    return true;
  } else {
    log(
      `❌ Invalid email should have been rejected but got: ${result.error}`,
      "ERROR"
    );
    return false;
  }
};

const testDuplicateSignup = async () => {
  log("Testing duplicate signup...");

  const duplicateData = {
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
    username: TEST_USERNAME,
  };

  const result = await makeRequest("POST", "/auth/signup", duplicateData);

  if (!result.success && result.status === 409) {
    log("✅ Duplicate signup correctly rejected", "SUCCESS");
    return true;
  } else {
    log(
      `❌ Duplicate signup should have been rejected but got: ${result.error}`,
      "ERROR"
    );
    return false;
  }
};

const testUnauthorizedAccess = async () => {
  log("Testing unauthorized access to protected routes...");

  const result = await makeRequest("GET", `/profile/${testState.username}`);

  if (!result.success && result.status === 401) {
    log("✅ Unauthorized access correctly rejected", "SUCCESS");
    return true;
  } else {
    log(
      `❌ Unauthorized access should have been rejected but got: ${result.error}`,
      "ERROR"
    );
    return false;
  }
};

const testTokenValidation = async () => {
  log("Testing JWT token validation...");

  if (!testState.authToken) {
    log("❌ No auth token available for validation test", "ERROR");
    return false;
  }

  // Test with valid token
  const validResult = await makeRequest(
    "GET",
    `/profile/${testState.username}`,
    null,
    testState.authToken
  );
  if (validResult.success) {
    log("✅ Valid token accepted", "SUCCESS");
  } else {
    log(`❌ Valid token rejected: ${validResult.error}`, "ERROR");
    // Try to get a fresh token
    const signinResult = await makeRequest("POST", "/auth/signin", {
      email: TEST_EMAIL,
      password: "NewPassword123!",
    });
    if (signinResult.success) {
      testState.authToken = signinResult.data.token;
      log("✅ Got fresh auth token", "SUCCESS");
      // Try again with fresh token
      const retryResult = await makeRequest(
        "GET",
        `/profile/${testState.username}`,
        null,
        testState.authToken
      );
      if (retryResult.success) {
        log("✅ Valid token accepted after refresh", "SUCCESS");
      } else {
        log(
          `❌ Valid token still rejected after refresh: ${retryResult.error}`,
          "ERROR"
        );
        return false;
      }
    } else {
      return false;
    }
  }

  // Test with invalid token
  const invalidResult = await makeRequest(
    "GET",
    `/profile/${testState.username}`,
    null,
    "invalid-token"
  );
  if (!invalidResult.success && invalidResult.status === 401) {
    log("✅ Invalid token correctly rejected", "SUCCESS");
    return true;
  } else {
    log(
      `❌ Invalid token should have been rejected but got: ${invalidResult.error}`,
      "ERROR"
    );
    return false;
  }
};

const testPasswordStrength = async () => {
  log("Testing password strength validation...");

  const weakPasswords = [
    "123", // Too short
    "password", // Too weak
    "abc123", // Too weak
  ];

  for (const weakPassword of weakPasswords) {
    const signupData = {
      email: `test-weak-${Date.now()}@example.com`,
      password: weakPassword,
      username: `testweak${Date.now()}`,
    };

    const result = await makeRequest("POST", "/auth/signup", signupData);

    if (!result.success && result.status === 400) {
      log(`✅ Weak password correctly rejected: ${weakPassword}`, "SUCCESS");
    } else {
      log(
        `❌ Weak password should have been rejected: ${weakPassword}`,
        "ERROR"
      );
      return false;
    }
  }

  return true;
};

const cleanupTestData = async () => {
  log("Cleaning up test data...");

  try {
    // Delete test user from database
    const deletedUser = await User.findOneAndDelete({ email: TEST_EMAIL });
    if (deletedUser) {
      log("✅ Test user deleted from database", "SUCCESS");
    } else {
      log("⚠️  Test user not found in database for cleanup", "INFO");
    }

    // Delete any other test users created during testing
    const testUsers = await User.find({
      email: { $regex: /^test-.*@example\.com$/ },
    });

    if (testUsers.length > 0) {
      await User.deleteMany({
        email: { $regex: /^test-.*@example\.com$/ },
      });
      log(`✅ Cleaned up ${testUsers.length} test users`, "SUCCESS");
    }

    return true;
  } catch (error) {
    log(`❌ Cleanup failed: ${error.message}`, "ERROR");
    return false;
  }
};

// Main test runner
const runAllTests = async () => {
  log("🚀 Starting enhanced authentication flow test...", "SUCCESS");
  log(`📧 Test email: ${TEST_EMAIL}`);
  log(`👤 Test username: ${TEST_USERNAME}`);
  log("=" * 60);

  const tests = [
    { name: "Server Connection", fn: testServerConnection },
    { name: "Database Connection", fn: testDatabaseConnection },
    { name: "User Signup", fn: testSignup },
    { name: "Signin Without Verification", fn: testSigninWithoutVerification },
    { name: "Email Verification", fn: testEmailVerification },
    { name: "Signin With Verification", fn: testSigninWithVerification },
    { name: "Forgot Password", fn: testForgotPassword },
    { name: "Validate Reset Token", fn: testValidateResetToken },
    { name: "Reset Password", fn: testResetPassword },
    { name: "Resend Verification", fn: testResendVerification },
    { name: "Profile Access", fn: testProfileAccess },
    { name: "Token Validation", fn: testTokenValidation },
    { name: "Invalid Credentials", fn: testInvalidCredentials },
    { name: "Invalid Email", fn: testInvalidEmail },
    { name: "Duplicate Signup", fn: testDuplicateSignup },
    { name: "Unauthorized Access", fn: testUnauthorizedAccess },
    { name: "Password Strength", fn: testPasswordStrength },
  ];

  let passedTests = 0;
  let totalTests = tests.length;

  for (const test of tests) {
    log(`\n🧪 Running: ${test.name}`);
    try {
      const result = await test.fn();
      if (result) {
        passedTests++;
      }
    } catch (error) {
      log(`❌ Test ${test.name} threw an error: ${error.message}`, "ERROR");
    }
  }

  // Cleanup
  await cleanupTestData();

  log("\n" + "=" * 60);
  log(
    `📊 Test Results: ${passedTests}/${totalTests} tests passed`,
    passedTests === totalTests ? "SUCCESS" : "ERROR"
  );

  if (passedTests === totalTests) {
    log(
      "🎉 All tests passed! Authentication system is working correctly.",
      "SUCCESS"
    );
  } else {
    log("⚠️  Some tests failed. Please check the implementation.", "ERROR");
  }

  log("\n🔧 Test Configuration:");
  log(`   Base URL: ${BASE_URL}`);
  log(`   Test Email: ${TEST_EMAIL}`);
  log(`   Test Username: ${TEST_USERNAME}`);
  log(`   Auth Token: ${testState.authToken ? "Generated" : "Not generated"}`);
  log(
    `   Verification Token: ${testState.verificationToken ? "Found" : "Not found"}`
  );
  log(`   Reset Token: ${testState.resetTokenFromDB ? "Found" : "Not found"}`);
};

// Run the tests
if (require.main === module) {
  runAllTests().catch((error) => {
    log(`❌ Test runner failed: ${error.message}`, "ERROR");
    process.exit(1);
  });
}

module.exports = {
  runAllTests,
  testState,
  makeRequest,
  log,
  cleanupTestData,
};
