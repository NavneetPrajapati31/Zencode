# Authentication Test Scripts

This directory contains comprehensive test scripts for the authentication and onboarding system.

## Test Scripts

### 1. Basic Test Script (`test-auth-flow.js`)

A comprehensive test script that covers all authentication functionality without database verification.

**Features:**

- ✅ User signup
- ✅ Email verification flow
- ✅ Signin with/without verification
- ✅ Forgot password
- ✅ Password reset
- ✅ Profile access
- ✅ Security tests (invalid credentials, unauthorized access)
- ✅ Duplicate signup prevention

### 2. Enhanced Test Script (`test-auth-flow-enhanced.js`)

An advanced test script with database verification and comprehensive testing.

**Additional Features:**

- ✅ Database connection testing
- ✅ Database verification of user creation
- ✅ Token extraction from database
- ✅ Password strength validation
- ✅ JWT token validation
- ✅ Automatic cleanup of test data
- ✅ Detailed logging and error reporting

## How to Run

### Prerequisites

1. Make sure your backend server is running on `http://localhost:5000`
2. Ensure MongoDB is running and accessible
3. Verify all environment variables are set (email configuration, JWT secret, etc.)

### Running the Tests

#### Basic Test

```bash
npm run test-auth
```

#### Enhanced Test (Recommended)

```bash
npm run test-auth-enhanced
```

### Manual Steps Required

Some tests require manual intervention:

1. **Email Verification**:
   - Check your email for verification links
   - Click the verification link or manually verify in database

2. **Password Reset**:
   - Check your email for reset links
   - Use the reset token from email or database

3. **Database Verification**:
   - The enhanced script will automatically verify database state
   - Check logs for database verification results

## Test Coverage

### Authentication Flow

- [x] User registration with email verification
- [x] Email verification process
- [x] Signin with email verification requirement
- [x] Forgot password functionality
- [x] Password reset with token validation
- [x] JWT token generation and validation
- [x] Profile access with authentication

### Security Tests

- [x] Invalid credentials rejection
- [x] Invalid email format rejection
- [x] Duplicate signup prevention
- [x] Unauthorized access blocking
- [x] Password strength validation
- [x] Token validation and expiration

### Database Tests

- [x] User creation verification
- [x] Email verification status tracking
- [x] Token storage and retrieval
- [x] Profile completion tracking
- [x] Data cleanup after tests

## Expected Output

### Successful Test Run

```
🚀 Starting enhanced authentication flow test...
📧 Test email: test-1234567890@example.com
👤 Test username: testuser1234567890
============================================================

🧪 Running: Server Connection
✅ Server is running and healthy

🧪 Running: Database Connection
✅ Database connected successfully

🧪 Running: User Signup
✅ Signup successful
   User created: test-1234567890@example.com
   Username: testuser1234567890
   Email verified: false
✅ User found in database: test-1234567890@example.com
   ID: 687c3ff4b5642d42079620dd
   Username: testuser1234567890
   Email Verified: false
   Profile Complete: true

...

📊 Test Results: 17/17 tests passed
🎉 All tests passed! Authentication system is working correctly.
```

### Failed Test Run

```
❌ Signup failed: User with this email already exists.
❌ Test User Signup threw an error: User with this email already exists.

📊 Test Results: 12/17 tests passed
⚠️  Some tests failed. Please check the implementation.
```

## Troubleshooting

### Common Issues

1. **Server Connection Failed**
   - Ensure backend server is running on port 5000
   - Check if the server is accessible at `http://localhost:5000/api/health`

2. **Database Connection Failed**
   - Verify MongoDB is running
   - Check MongoDB connection string in environment variables
   - Ensure database permissions are correct

3. **Email Tests Failing**
   - Verify email configuration in environment variables
   - Check Gmail OAuth2 setup
   - Ensure email credentials are correct

4. **Token Validation Failing**
   - Check JWT_SECRET environment variable
   - Verify token expiration settings
   - Ensure token generation includes all required fields

### Environment Variables Required

```bash
# Database
MONGODB_URI=mongodb://localhost:27017/zencode

# JWT
JWT_SECRET=your-secret-key

# Email Configuration (Gmail OAuth2)
EMAIL_USER=your-email@gmail.com
GOOGLE_EMAIL_CLIENT_ID=your-client-id
GOOGLE_EMAIL_CLIENT_SECRET=your-client-secret
GOOGLE_REFRESH_TOKEN=your-refresh-token

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

## Customization

### Modifying Test Data

Edit the configuration section in the test scripts:

```javascript
const TEST_EMAIL = `test-${Date.now()}@example.com`;
const TEST_PASSWORD = "TestPassword123!";
const TEST_USERNAME = `testuser${Date.now()}`;
```

### Adding New Tests

Add new test functions and include them in the tests array:

```javascript
const testNewFeature = async () => {
  log("Testing new feature...");
  // Your test logic here
  return true; // or false
};

const tests = [
  // ... existing tests
  { name: "New Feature", fn: testNewFeature },
];
```

## Integration with CI/CD

These test scripts can be integrated into your CI/CD pipeline:

```yaml
# Example GitHub Actions workflow
- name: Test Authentication
  run: |
    cd backend
    npm run test-auth-enhanced
```

## Support

If you encounter issues with the test scripts:

1. Check the console output for detailed error messages
2. Verify all environment variables are set correctly
3. Ensure the backend server and database are running
4. Check the logs for specific failure points

The enhanced test script provides detailed logging to help identify issues quickly.
