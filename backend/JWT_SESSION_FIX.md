# 🔐 JWT Session Fix for Serverless Deployment

## 🚨 **Problem Identified**

Your backend was experiencing **automatic logout** issues because:

1. **Express Sessions Don't Work in Serverless**: Vercel serverless functions don't share memory between invocations
2. **Mixed Authentication**: Using both sessions and JWT tokens created conflicts
3. **Session State Loss**: Each function call started fresh, losing user session data

## ✅ **Solution Implemented**

### **Backend Changes Made:**

1. **Removed `express-session` middleware** - No more server-side sessions
2. **Updated Passport OAuth** - Now uses `{ session: false }` for stateless authentication
3. **JWT-Only Authentication** - All authentication now uses JWT tokens
4. **Added Token Refresh Endpoint** - `/api/auth/refresh-token` to extend sessions

### **Key Files Modified:**

- `backend/api/index.js` - Removed session middleware
- `backend/routes/auth.js` - Updated OAuth routes, added refresh endpoint
- `backend/controllers/oauth.js` - Simplified OAuth callback
- `backend/package.json` - Removed `express-session` dependency

## 🔧 **Frontend Implementation Required**

### **1. Token Storage Strategy**

```javascript
// Store JWT token in localStorage or secure storage
const storeToken = (token) => {
  localStorage.setItem("authToken", token);
  // Also store expiration time
  const decoded = jwt_decode(token);
  localStorage.setItem("tokenExpiry", decoded.exp * 1000);
};

// Retrieve token
const getToken = () => {
  const token = localStorage.getItem("authToken");
  const expiry = localStorage.getItem("tokenExpiry");

  if (!token || !expiry) return null;

  // Check if token is expired
  if (Date.now() > expiry) {
    localStorage.removeItem("authToken");
    localStorage.removeItem("tokenExpiry");
    return null;
  }

  return token;
};
```

### **2. Automatic Token Refresh**

```javascript
// Refresh token before it expires
const refreshTokenIfNeeded = async () => {
  const token = getToken();
  if (!token) return null;

  const decoded = jwt_decode(token);
  const timeUntilExpiry = decoded.exp * 1000 - Date.now();

  // If token expires in less than 1 hour, refresh it
  if (timeUntilExpiry < 60 * 60 * 1000) {
    try {
      const response = await fetch("/api/auth/refresh-token", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const { token: newToken } = await response.json();
        storeToken(newToken);
        return newToken;
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
    }
  }

  return token;
};
```

### **3. API Request Interceptor**

```javascript
// Add token to all API requests
const apiRequest = async (url, options = {}) => {
  let token = getToken();

  // Try to refresh token if needed
  if (token) {
    token = await refreshTokenIfNeeded();
  }

  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, config);

  // Handle 401 responses (token expired/invalid)
  if (response.status === 401) {
    localStorage.removeItem("authToken");
    localStorage.removeItem("tokenExpiry");
    // Redirect to login
    window.location.href = "/signin";
    return;
  }

  return response;
};
```

### **4. OAuth Callback Handling**

```javascript
// Handle OAuth callback with JWT token
const handleOAuthCallback = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");
  const profileComplete = urlParams.get("profileComplete");
  const userId = urlParams.get("userId");

  if (token) {
    storeToken(token);

    // Redirect based on profile completion
    if (profileComplete === "false") {
      window.location.href = "/complete-profile";
    } else {
      window.location.href = "/dashboard";
    }
  } else {
    // Handle OAuth error
    const error = urlParams.get("error");
    console.error("OAuth error:", error);
    window.location.href = "/signin?error=" + error;
  }
};
```

### **5. Protected Route Wrapper**

```javascript
// Higher-order component for protected routes
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        // Verify token with backend
        const response = await apiRequest("/api/auth/verify-token");
        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/signin" />;
};
```

## 🚀 **Deployment Steps**

1. **Deploy Backend Changes:**

   ```bash
   cd backend
   vercel --prod
   ```

2. **Update Frontend Environment:**

   ```env
   REACT_APP_API_URL=https://api.zencode.space
   ```

3. **Implement Frontend Changes** (see code examples above)

4. **Test Authentication Flow:**
   - Sign in with email/password
   - OAuth login (Google/GitHub)
   - Token refresh
   - Protected route access

## 🔍 **Testing the Fix**

### **Backend Health Check:**

```bash
curl https://api.zencode.space/api/health
```

### **Token Refresh Test:**

```bash
# First get a token by signing in
# Then test refresh endpoint
curl -X POST https://api.zencode.space/api/auth/refresh-token \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

## 📝 **Benefits of This Approach**

1. **✅ Serverless Compatible**: No session state to maintain
2. **✅ Scalable**: JWT tokens work across multiple server instances
3. **✅ Stateless**: Each request is independent
4. **✅ Secure**: Tokens can be revoked and have expiration
5. **✅ Mobile Friendly**: Works with mobile apps and PWA

## ⚠️ **Important Notes**

1. **JWT Secret**: Ensure `JWT_SECRET` is set in Vercel environment variables
2. **Token Expiration**: Tokens expire in 7 days, implement refresh logic
3. **HTTPS Only**: Always use HTTPS in production for secure token transmission
4. **Token Storage**: Consider using `httpOnly` cookies for additional security

## 🆘 **Troubleshooting**

### **Common Issues:**

1. **"Invalid token" errors**: Check JWT_SECRET in environment variables
2. **OAuth redirects failing**: Verify callback URLs in OAuth provider settings
3. **Token not persisting**: Check localStorage implementation and token refresh logic
4. **CORS errors**: Ensure FRONTEND_URL is set correctly in backend

### **Debug Commands:**

```bash
# Check Vercel logs
vercel logs

# Test API endpoints
curl -v https://api.zencode.space/api/health

# Verify environment variables
vercel env ls
```

This fix should resolve your automatic logout issues and provide a robust, serverless-compatible authentication system! 🎉
