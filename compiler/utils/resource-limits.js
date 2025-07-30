const { spawn } = require("child_process");
const os = require("os");

// Global resource limits
const GLOBAL_LIMITS = {
  TIME_LIMIT: 5000, // 5 seconds in milliseconds
  MEMORY_LIMIT: 256 * 1024 * 1024, // 256 MB in bytes
};

/**
 * Creates a child process with resource limits and monitoring
 * @param {string} command - The command to execute
 * @param {string[]} args - Command arguments
 * @param {Object} options - Spawn options
 * @param {string} input - Input to provide to the process
 * @returns {Promise<Object>} - Promise that resolves with stdout/stderr or rejects with error
 */
const createLimitedProcess = (command, args, options = {}, input = "") => {
  return new Promise((resolve, reject) => {
    let processKilled = false;
    let timeoutId = null;
    let memoryCheckInterval = null;

    // Create the child process
    const child = spawn(command, args, {
      ...options,
      stdio: ["pipe", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";

    // Set up timeout for time limit
    timeoutId = setTimeout(() => {
      if (!processKilled) {
        processKilled = true;
        console.log(
          `[Resource Limits] Process timed out after ${GLOBAL_LIMITS.TIME_LIMIT}ms`
        );

        // Force kill the process and its children
        try {
          if (process.platform === "win32") {
            spawn("taskkill", ["/pid", child.pid, "/f", "/t"]);
          } else {
            child.kill("SIGKILL");
          }
        } catch (err) {
          console.error(
            "[Resource Limits] Error killing timed out process:",
            err
          );
        }

        reject({
          error: `Time limit exceeded (${GLOBAL_LIMITS.TIME_LIMIT}ms)`,
          stderr: "Process killed due to time limit",
          type: "TIME_LIMIT_EXCEEDED",
        });
      }
    }, GLOBAL_LIMITS.TIME_LIMIT);

    // Monitor memory usage (only on Unix-like systems)
    if (process.platform !== "win32") {
      memoryCheckInterval = setInterval(() => {
        try {
          // Get process memory usage
          const memoryUsage = process.memoryUsage();
          const processMemory = memoryUsage.rss; // Resident Set Size

          if (processMemory > GLOBAL_LIMITS.MEMORY_LIMIT && !processKilled) {
            processKilled = true;
            console.log(
              `[Resource Limits] Memory limit exceeded: ${Math.round(processMemory / 1024 / 1024)}MB > ${Math.round(GLOBAL_LIMITS.MEMORY_LIMIT / 1024 / 1024)}MB`
            );

            // Kill the process
            child.kill("SIGKILL");

            reject({
              error: `Memory limit exceeded (${Math.round(GLOBAL_LIMITS.MEMORY_LIMIT / 1024 / 1024)}MB)`,
              stderr: "Process killed due to memory limit",
              type: "MEMORY_LIMIT_EXCEEDED",
            });
          }
        } catch (err) {
          console.error("[Resource Limits] Error checking memory:", err);
        }
      }, 100); // Check every 100ms
    }

    // Provide input to the process
    if (input) {
      child.stdin.write(input);
    }
    child.stdin.end();

    // Handle stdout
    child.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    // Handle stderr
    child.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    // Handle process completion
    child.on("close", (code) => {
      // Clear timers
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (memoryCheckInterval) {
        clearInterval(memoryCheckInterval);
      }

      if (processKilled) {
        return; // Already handled by timeout or memory limit
      }

      if (code !== 0) {
        reject({
          error: `Process exited with code ${code}`,
          stderr,
          type: "RUNTIME_ERROR",
        });
      } else {
        resolve({ stdout, stderr });
      }
    });

    // Handle process errors
    child.on("error", (err) => {
      // Clear timers
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (memoryCheckInterval) {
        clearInterval(memoryCheckInterval);
      }

      if (!processKilled) {
        reject({
          error: err.message,
          stderr,
          type: "PROCESS_ERROR",
        });
      }
    });
  });
};

/**
 * Executes a command with resource limits
 * @param {string} command - The command to execute
 * @param {string[]} args - Command arguments
 * @param {Object} options - Spawn options
 * @param {string} input - Input to provide to the process
 * @returns {Promise<Object>} - Promise that resolves with stdout/stderr or rejects with error
 */
const executeWithLimits = async (command, args, options = {}, input = "") => {
  try {
    return await createLimitedProcess(command, args, options, input);
  } catch (error) {
    // Ensure we have a consistent error format
    if (typeof error === "string") {
      throw {
        error,
        stderr: "",
        type: "UNKNOWN_ERROR",
      };
    }
    throw error;
  }
};

module.exports = {
  executeWithLimits,
  GLOBAL_LIMITS,
};
