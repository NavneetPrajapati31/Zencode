# Online Judge Server

## Updated Database Structure

### Collections and Models

#### 1. Users Collection

- **Model**: `User.js`
- **Fields**:
  - `email`: String (required, unique, lowercase)
  - `password`: String (required, min 6 chars, hashed)
  - `avatar`: String (optional, default: "")
  - `name`: String (optional, default: "")
  - `createdAt`: Date (auto-generated)

#### 2. Problems Collection

- **Model**: `Problem.js`
- **Fields**:
  - `statement`: String (required)
  - `name`: String (required)
  - `code`: String (required)
  - `difficulty`: String (optional, enum: ["Easy", "Medium", "Hard"])
  - `createdAt`: Date (auto-generated)

#### 3. Problem Details Collection

- **Model**: `ProblemDetails.js`
- **Fields**:
  - `problemId`: ObjectId (required, ref: "Problem")
  - `tags`: [String] (array of tags)
  - `constraints`: [String] (array of constraints)
  - `examples`: [Object] (array of example objects with input, output, explanation)
  - `boilerplate`: Object (code templates for different languages)
  - `harness`: Object (test harness code for different languages)
  - `originalId`: String (original problem ID from import)

#### 4. Submissions Collection

- **Model**: `Submission.js`
- **Fields**:
  - `problem`: ObjectId (required, ref: "Problem")
  - `verdict`: String (required)
  - `submittedAt`: Date (auto-generated)

#### 5. Test Cases Collection

- **Model**: `TestCase.js`
- **Fields**:
  - `input`: String (required)
  - `output`: String (required)
  - `problem`: ObjectId (required, ref: "Problem")

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login user
- `GET /api/auth/github` - GitHub OAuth
- `GET /api/auth/google` - Google OAuth

### Problems

- `GET /api/problems` - Get all problems
- `GET /api/problems/:id` - Get problem by ID
- `POST /api/problems` - Create new problem (protected)
- `PUT /api/problems/:id` - Update problem (protected)
- `DELETE /api/problems/:id` - Delete problem (protected)

### Problem Details

- `GET /api/problem-details` - Get all problem details
- `GET /api/problem-details/:id` - Get problem details by ID
- `GET /api/problem-details/problem/:problemId` - Get details by problem ID
- `GET /api/problem-details/full/:problemId` - Get problem with full details
- `POST /api/problem-details` - Create problem details (protected)
- `PUT /api/problem-details/:id` - Update problem details (protected)
- `DELETE /api/problem-details/:id` - Delete problem details (protected)

### Submissions

- `GET /api/submissions` - Get all submissions
- `GET /api/submissions/:id` - Get submission by ID
- `GET /api/submissions/problem/:problemId` - Get submissions by problem
- `POST /api/submissions` - Create new submission (protected)
- `PUT /api/submissions/:id` - Update submission (protected)
- `DELETE /api/submissions/:id` - Delete submission (protected)

### Test Cases

- `GET /api/testcases` - Get all test cases
- `GET /api/testcases/:id` - Get test case by ID
- `GET /api/testcases/problem/:problemId` - Get test cases by problem
- `POST /api/testcases` - Create new test case (protected)
- `PUT /api/testcases/:id` - Update test case (protected)
- `DELETE /api/testcases/:id` - Delete test case (protected)

## Request/Response Examples

### User Registration

```json
POST /api/auth/signup
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Problem Creation

```json
POST /api/problems
{
  "statement": "Find the sum of two numbers",
  "name": "Two Sum",
  "code": "def two_sum(a, b): return a + b",
  "difficulty": "Easy"
}
```

### Problem Details Creation

```json
POST /api/problem-details
{
  "problemId": "64f1a2b3c4d5e6f7g8h9i0j1",
  "tags": ["array", "hashmap"],
  "constraints": ["2 <= nums.length <= 10^4"],
  "examples": [
    {
      "input": "[2,7,11,15]\n9",
      "output": "[0,1]",
      "explanation": "Because nums[0] + nums[1] == 9"
    }
  ],
  "boilerplate": {
    "python": "def twoSum(nums, target):\n    # your code here\n    pass",
    "javascript": "function twoSum(nums, target) {\n    // your code here\n}"
  }
}
```

### Submission Creation

```json
POST /api/submissions
{
  "problemId": "64f1a2b3c4d5e6f7g8h9i0j1",
  "verdict": "Accepted"
}
```

### Test Case Creation

```json
POST /api/testcases
{
  "problemId": "64f1a2b3c4d5e6f7g8h9i0j1",
  "input": "5 3",
  "output": "8"
}
```

### Get Problem with Full Details

```json
GET /api/problem-details/full/64f1a2b3c4d5e6f7g8h9i0j1

Response:
{
  "problem": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "statement": "Two Sum\n\nGiven an array...",
    "name": "Two Sum",
    "code": "def twoSum(nums, target):...",
    "difficulty": "Easy"
  },
  "details": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j2",
    "problemId": "64f1a2b3c4d5e6f7g8h9i0j1",
    "tags": ["array", "hashmap"],
    "constraints": ["2 <= nums.length <= 10^4"],
    "examples": [...],
    "boilerplate": {...},
    "harness": {...}
  }
}
```

## MongoDB Setup and Troubleshooting

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)

### Installation

1. Install dependencies:

```bash
npm install
```

2. Create environment file:

```bash
# Copy the .env.example or create .env manually
```

3. Start the server:

```bash
npm run dev
```

### MongoDB Connection Issues

#### Common Problems and Solutions

1. **Connection Refused Error**
   - **Problem**: `ECONNREFUSED` or `HostUnreachable`
   - **Solution**: Ensure MongoDB is running

   ```bash
   # Windows
   net start MongoDB

   # macOS
   brew services start mongodb-community

   # Linux
   sudo systemctl start mongod
   ```

2. **Authentication Issues**
   - **Problem**: Authentication failed
   - **Solution**: Check MongoDB credentials in `.env` file

   ```env
   MONGODB_URI=mongodb://username:password@localhost:27017/zencode
   ```

3. **Network Timeout Issues**
   - **Problem**: Connection timeouts in logs
   - **Solution**: The server now includes improved timeout handling and retry logic

4. **NamespaceNotFound Error**
   - **Problem**: `config.system.sessions does not exist`
   - **Solution**: This is a warning that can be ignored, but ensure proper database initialization

### Health Check

Check MongoDB status:

```bash
npm run check-mongodb
```

Or visit the health endpoint:

```
GET http://localhost:5000/api/health
```

### Environment Variables

Create a `.env` file in the server directory:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d

# OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_CALLBACK_URL=http://localhost:5000/api/auth/github/callback

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### Database Management

The server now includes:

- ✅ Automatic retry logic (up to 5 attempts)
- ✅ Connection pooling optimization
- ✅ Graceful shutdown handling
- ✅ Real-time connection monitoring
- ✅ Health check endpoints
- ✅ Improved error logging

### Troubleshooting Steps

1. **Check if MongoDB is running**:

   ```bash
   # Windows
   sc query MongoDB

   # macOS/Linux
   ps aux | grep mongod
   ```

2. **Test MongoDB connection**:

   ```bash
   npm run check-mongodb
   ```

3. **Check server logs**:

   ```bash
   npm run dev
   ```

4. **Verify port availability**:
   ```bash
   # Check if port 27017 is in use
   netstat -an | findstr 27017
   ```

### Performance Optimizations

The server now includes:

- Connection pooling (max 10, min 2 connections)
- Socket timeout management (45s)
- Server selection timeout (5s)
- Automatic reconnection
- Buffer management

### Monitoring

Monitor the database connection status:

```javascript
// In your application
const databaseManager = require("./config/database");
const status = databaseManager.getStatus();
console.log(status);
```

### Log Files

MongoDB logs are stored in:

- Windows: `C:\Program Files\MongoDB\Server\[version]\log\mongod.log`
- Linux/macOS: `/var/log/mongodb/mongod.log`

Check for specific errors:

```bash
# Search for errors in MongoDB log
grep -i "error\|failed\|exception" mongod.log
```
