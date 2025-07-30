const { GLOBAL_LIMITS } = require("./resource-limits");

/**
 * Utility to check and display current resource limits configuration
 */
function checkResourceLimits() {
  console.log("🔍 Resource Limits Configuration Check");
  console.log("=====================================");

  // Display current limits
  console.log(
    `⏱️  Time Limit: ${GLOBAL_LIMITS.TIME_LIMIT}ms (${GLOBAL_LIMITS.TIME_LIMIT / 1000}s)`
  );
  console.log(
    `💾 Memory Limit: ${GLOBAL_LIMITS.MEMORY_LIMIT} bytes (${Math.round(GLOBAL_LIMITS.MEMORY_LIMIT / 1024 / 1024)}MB)`
  );

  // Check if limits are reasonable
  const timeLimitSeconds = GLOBAL_LIMITS.TIME_LIMIT / 1000;
  const memoryLimitMB = GLOBAL_LIMITS.MEMORY_LIMIT / 1024 / 1024;

  console.log("\n📊 Limit Analysis:");

  if (timeLimitSeconds >= 1 && timeLimitSeconds <= 10) {
    console.log("✅ Time limit is reasonable (1-10 seconds)");
  } else {
    console.log("⚠️  Time limit may be too short or too long");
  }

  if (memoryLimitMB >= 64 && memoryLimitMB <= 512) {
    console.log("✅ Memory limit is reasonable (64-512 MB)");
  } else {
    console.log("⚠️  Memory limit may be too low or too high");
  }

  // Platform-specific information
  console.log("\n🖥️  Platform Information:");
  console.log(`Platform: ${process.platform}`);
  console.log(`Node.js Version: ${process.version}`);
  console.log(`Architecture: ${process.arch}`);

  // Memory monitoring availability
  if (process.platform !== "win32") {
    console.log("✅ Memory monitoring available (Unix-like system)");
  } else {
    console.log("⚠️  Memory monitoring limited on Windows (time limits only)");
  }

  console.log("\n✨ Configuration check completed!");
}

// Export for use in other modules
module.exports = { checkResourceLimits };

// Run check if this file is executed directly
if (require.main === module) {
  checkResourceLimits();
}
