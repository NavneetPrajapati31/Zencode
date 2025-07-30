# Resource Limits Implementation

This document describes the resource limits implementation for the Zencode compiler server.

## Overview

The compiler server now implements robust time and memory limits to prevent user-submitted code from exhausting system resources. All code execution is monitored and automatically terminated if limits are exceeded.

## Global Limits

- **Time Limit**: 5 seconds (5000ms)
- **Memory Limit**: 256 MB (268,435,456 bytes)

These limits are defined in `utils/resource-limits.js` and apply to all supported programming languages.

## Implementation Details

### Resource Limits Utility (`utils/resource-limits.js`)

The core resource management is handled by the `executeWithLimits` function which:

1. **Time Monitoring**: Uses `setTimeout` to kill processes that exceed the 5-second limit
2. **Memory Monitoring**: On Unix-like systems, monitors process memory usage every 100ms
3. **Process Cleanup**: Ensures complete process termination including child processes
4. **Error Handling**: Provides detailed error information with specific error types

### Supported Error Types

- `TIME_LIMIT_EXCEEDED`: Process exceeded 5-second time limit
- `MEMORY_LIMIT_EXCEEDED`: Process exceeded 256MB memory limit
- `RUNTIME_ERROR`: Process exited with non-zero code
- `PROCESS_ERROR`: Process failed to start or encountered system error

### Updated Runners

All language runners have been updated to use the resource limits:

- `execute-c.js`: C language execution with limits
- `execute-cpp.js`: C++ language execution with limits
- `execute-java.js`: Java language execution with limits
- `execute-python.js`: Python language execution with limits
- `execute-javascript.js`: JavaScript/Node.js execution with limits

## API Response Format

When limits are exceeded, the API returns appropriate HTTP status codes:

- **408 Request Timeout**: Time limit exceeded
- **413 Payload Too Large**: Memory limit exceeded
- **500 Internal Server Error**: Runtime or process errors

Example error response:

```json
{
  "success": false,
  "error": "Time limit exceeded (5 seconds)",
  "stderr": "Process killed due to time limit",
  "type": "TIME_LIMIT_EXCEEDED"
}
```

## Testing

Run the test suite to verify resource limits are working:

```bash
cd compiler
node test-resource-limits.js
```

The test suite includes:

- Infinite loops (time limit testing)
- Memory-intensive operations (memory limit testing)
- Multiple programming languages
- Error type verification

## Security Considerations

1. **Process Isolation**: Each execution runs in a separate process
2. **Resource Monitoring**: Continuous monitoring prevents resource exhaustion
3. **Force Termination**: Processes are forcefully killed when limits are exceeded
4. **Cross-Platform Support**: Works on both Windows and Unix-like systems

## Configuration

To modify limits, edit the `GLOBAL_LIMITS` object in `utils/resource-limits.js`:

```javascript
const GLOBAL_LIMITS = {
  TIME_LIMIT: 5000, // 5 seconds in milliseconds
  MEMORY_LIMIT: 256 * 1024 * 1024, // 256 MB in bytes
};
```

## Monitoring and Logging

The implementation includes comprehensive logging:

- Resource limit violations are logged with details
- Process termination events are tracked
- Error types and messages are preserved for debugging

## Performance Impact

- **Memory Monitoring**: Only active on Unix-like systems (Linux, macOS)
- **Monitoring Frequency**: Memory checked every 100ms
- **Overhead**: Minimal impact on normal execution
- **Timeout Resolution**: 1ms precision for time limits
