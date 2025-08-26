# Serverless Deployment Guide for Zencode Compiler

## Overview

The Zencode compiler has been updated to work in serverless environments (like Vercel, AWS Lambda, etc.) by implementing in-memory compilation instead of relying on persistent file system access.

## Changes Made

### 1. Virtual File System (`generateFile.js`)

- **Before**: Always wrote files to local `codes/` directory
- **After**: Detects serverless environment and returns virtual file objects
- **Benefit**: No more read-only filesystem errors

### 2. Updated Language Runners

All language runners now support both virtual and real files:

- `execute-cpp.js` - C++ compilation and execution
- `execute-c.js` - C compilation and execution
- `execute-java.js` - Java compilation and execution
- `execute-python.js` - Python execution
- `execute-javascript.js` - JavaScript execution

### 3. Serverless Environment Detection

Automatically detects serverless environments using:

- `process.env.VERCEL`
- `process.env.NODE_ENV === 'production'`
- `process.env.AWS_LAMBDA_FUNCTION_NAME`
- `process.env.FUNCTIONS_WORKER_RUNTIME`
- `process.env.KUBERNETES_SERVICE_HOST`

## How It Works

### Local Development

```javascript
// Files are written to ./codes/ directory
const fileObj = generateFile("cpp", code);
// Returns: { filePath: './codes/uuid.cpp', isVirtual: false }
```

### Serverless Environment

```javascript
// Virtual files stored in memory, use /tmp for compilation
const fileObj = generateFile("cpp", code);
// Returns: {
//   filePath: '/tmp/uuid.cpp',
//   isVirtual: true,
//   content: code,
//   fileId: 'uuid',
//   fileName: 'uuid.cpp'
// }
```

## Deployment Steps

### 1. Vercel Deployment

```bash
# Deploy to Vercel
vercel --prod
```

### 2. Environment Variables

Set these in your Vercel dashboard:

```
NODE_ENV=production
VERCEL=true
```

### 3. Build Configuration

The `vercel.json` is already configured with:

- 30-second function timeout
- Proper routing
- Node.js 22.x runtime

## Testing

### Local Testing

```bash
cd compiler
node test-virtual-files.js
```

### Serverless Testing

Deploy and test with a simple C++ program:

```cpp
#include <iostream>
using namespace std;

int main() {
    cout << "Hello Serverless!" << endl;
    return 0;
}
```

## Troubleshooting

### Common Issues

1. **Read-only filesystem error**
   - Solution: Ensure `VERCEL=true` environment variable is set
   - Check that serverless detection is working

2. **Compilation timeout**
   - Solution: Increase function timeout in `vercel.json`
   - Current limit: 30 seconds

3. **Memory issues**
   - Solution: Check resource limits in `utils/resource-limits.js`
   - Current limits: 256MB RAM, 5 seconds CPU

### Debug Logs

The compiler now includes extensive logging:

```
[Compiler] Using in-memory compilation for serverless environment
[C++ Runner] Virtual execution for: uuid.cpp
[C++ Runner] Wrote code to temporary file: /tmp/uuid.cpp
```

## Performance Considerations

### Advantages

- ✅ No filesystem I/O overhead
- ✅ Faster cold starts
- ✅ Better resource utilization

### Limitations

- ⚠️ Temporary files still needed for compilation
- ⚠️ Memory usage for large code files
- ⚠️ /tmp directory cleanup required

## Future Improvements

1. **Pure in-memory compilation** for interpreted languages (Python, JavaScript)
2. **Docker-based compilation** for better isolation
3. **Caching layer** for compiled binaries
4. **Distributed compilation** across multiple functions

## Support

For issues or questions:

1. Check the logs for detailed error messages
2. Verify environment variables are set correctly
3. Test with minimal code examples first
4. Ensure all dependencies are properly installed

---

**Note**: This implementation maintains backward compatibility with local development while enabling serverless deployment.
