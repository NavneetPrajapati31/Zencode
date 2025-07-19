const express = require("express");
const cors = require("cors");
const databaseManager = require("./config/database");
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const problemRoutes = require("./routes/problem");
const submissionRoutes = require("./routes/submission");
const testcaseRoutes = require("./routes/testcase");
const problemDetailsRoutes = require("./routes/problemDetails");
const dotenv = require("dotenv");
dotenv.config();
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("./models/User");
const axios = require("axios");
const leaderboardRoutes = require("./routes/leaderboard");

console.log("TEST_ENV:", process.env.TEST_ENV); // Debug: should print 'hello' if .env is loaded
console.log("TEST_ENV:", process.env.TEST_ENV); // Add this for testing
console.log("[DEBUG] GITHUB_CLIENT_ID:", process.env.GITHUB_CLIENT_ID);
console.log("[DEBUG] GITHUB_CALLBACK_URL:", process.env.GITHUB_CALLBACK_URL);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware (for OAuth handshake only)
app.use(
  session({
    secret: process.env.JWT_SECRET || "supersecretkey",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Passport serialize/deserialize
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      const email =
        profile.emails && profile.emails[0] && profile.emails[0].value;
      const photo =
        profile.photos && profile.photos[0] && profile.photos[0].value;
      const name = profile.displayName || "";
      if (!email) return done(null, false);
      return done(null, { email, photo, name });
    }
  )
);

// GitHub Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let email = null;
        // Try to get email from profile
        if (profile.emails && profile.emails.length > 0) {
          email = profile.emails[0].value;
        } else if (profile._json && profile._json.email) {
          email = profile._json.email;
        }
        // If still no email, fetch from GitHub API
        if (!email) {
          const emailsRes = await axios.get(
            "https://api.github.com/user/emails",
            {
              headers: { Authorization: `token ${accessToken}` },
            }
          );
          const emails = emailsRes.data;
          // Find primary, verified email
          const primaryEmail = emails.find((e) => e.primary && e.verified);
          if (primaryEmail) {
            email = primaryEmail.email;
          } else if (emails.length > 0) {
            email = emails[0].email;
          }
        }
        const photo = profile._json && profile._json.avatar_url;
        const name = profile.displayName || profile.username || "";
        if (!email) {
          console.error(
            "[DEBUG] No email found for GitHub user after API call",
            profile
          );
          return done(null, false);
        }
        return done(null, { email, photo, name });
      } catch (err) {
        console.error("[DEBUG] Error in GitHubStrategy callback:", err);
        return done(err, false);
      }
    }
  )
);

// Initialize database connection
databaseManager.connect();

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Online Judge API" });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/testcases", testcaseRoutes);
app.use("/api/problem-details", problemDetailsRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
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
  console.log("TEST_ENV:", process.env.TEST_ENV);
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(
    `📊 Health check available at http://localhost:${PORT}/api/health`
  );
});
