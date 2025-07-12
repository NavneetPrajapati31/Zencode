const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const databaseManager = require("./config/database");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database connection
databaseManager.connect();

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Online Judge API" });
});

// API Routes
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working!" });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  const dbStatus = databaseManager.getStatus();
  res.json({
    status: "ok",
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(
    `📊 Health check available at http://localhost:${PORT}/api/health`
  );
});
