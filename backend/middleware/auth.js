const jwt = require("jsonwebtoken");

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "935dacfee06f8c8bcf458d9fcab55704d0ceaa6a94e05d68796f9905855282f5a67d8322e305b2b970baebaa4507d4837157f2829c737547a779c4558e9de3c5";

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided." });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

// Role-based authorization middleware
const authorizeRole = (role) => (req, res, next) => {
  if (!req.user || req.user.role !== role) {
    return res
      .status(403)
      .json({ message: "Forbidden: Insufficient privileges." });
  }
  next();
};

const requireProfileComplete = (req, res, next) => {
  console.log("[Middleware] requireProfileComplete called");
  console.log("[Middleware] Request method:", req.method);
  console.log("[Middleware] Request path:", req.path);
  console.log("[Middleware] User:", req.user);

  // Allow access to profile completion endpoint
  if (req.path === "/api/auth/complete-profile") {
    console.log("[Middleware] Allowing profile completion endpoint");
    return next();
  }

  // Allow access to profile GET endpoint (for fetching user data)
  // Since this middleware is applied to /api/profile routes, the path will be just the username
  if (req.method === "GET" && req.path.match(/^\/[^\/]+$/)) {
    console.log("[Middleware] Allowing profile GET endpoint");
    return next();
  }

  if (req.user && req.user.profileComplete === false) {
    console.log("[Middleware] Blocking - profile incomplete");
    return res
      .status(403)
      .json({ message: "Profile incomplete. Please complete your profile." });
  }

  console.log("[Middleware] Allowing request");
  next();
};

module.exports = { authenticateJWT, authorizeRole, requireProfileComplete };
