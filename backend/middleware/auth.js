const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

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
  // Allow access to profile completion endpoint
  if (req.path === "/api/auth/complete-profile") return next();
  if (req.user && req.user.profileComplete === false) {
    return res
      .status(403)
      .json({ message: "Profile incomplete. Please complete your profile." });
  }
  next();
};

module.exports = { authenticateJWT, authorizeRole, requireProfileComplete };
