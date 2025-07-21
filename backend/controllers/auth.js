const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { GoogleAuth } = require("google-auth-library");

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "935dacfee06f8c8bcf458d9fcab55704d0ceaa6a94e05d68796f9905855282f5a67d8322e305b2b970baebaa4507d4837157f2829c737547a779c4558e9de3c5";
const JWT_EXPIRES_IN = "7d";

// Email configuration with OAuth2
const createTransporter = async () => {
  try {
    console.log("Creating OAuth2 transporter...");
    console.log("Environment variables check:");
    console.log("EMAIL_USER:", process.env.EMAIL_USER ? "Set" : "Missing");
    console.log("EMAIL_USER value:", process.env.EMAIL_USER);
    console.log(
      "GOOGLE_EMAIL_CLIENT_ID:",
      process.env.GOOGLE_EMAIL_CLIENT_ID ? "Set" : "Missing"
    );
    console.log(
      "GOOGLE_EMAIL_CLIENT_ID value:",
      process.env.GOOGLE_EMAIL_CLIENT_ID
    );
    console.log(
      "GOOGLE_EMAIL_CLIENT_SECRET:",
      process.env.GOOGLE_EMAIL_CLIENT_SECRET ? "Set" : "Missing"
    );
    console.log(
      "GOOGLE_EMAIL_CLIENT_SECRET value:",
      process.env.GOOGLE_EMAIL_CLIENT_SECRET
    );
    console.log(
      "GOOGLE_REFRESH_TOKEN:",
      process.env.GOOGLE_REFRESH_TOKEN ? "Set" : "Missing"
    );
    console.log(
      "GOOGLE_REFRESH_TOKEN value:",
      process.env.GOOGLE_REFRESH_TOKEN
    );

    // Check if GoogleAuth object is available
    console.log("Checking GoogleAuth object:", typeof GoogleAuth);
    if (!GoogleAuth) {
      throw new Error("Google auth library not properly imported");
    }

    console.log("Creating OAuth2 client...");
    const { OAuth2Client } = require("google-auth-library");
    const oauth2Client = new OAuth2Client(
      process.env.GOOGLE_EMAIL_CLIENT_ID,
      process.env.GOOGLE_EMAIL_CLIENT_SECRET,
      "https://developers.google.com/oauthplayground"
    );

    console.log("Setting credentials...");
    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    console.log("Getting access token...");
    const accessToken = await oauth2Client.getAccessToken();
    console.log("Access token obtained successfully");

    console.log("Creating nodemailer transporter...");
    console.log("Nodemailer object:", typeof nodemailer);
    console.log("Nodemailer methods:", Object.keys(nodemailer || {}));
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL_USER,
        clientId: process.env.GOOGLE_EMAIL_CLIENT_ID,
        clientSecret: process.env.GOOGLE_EMAIL_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    console.log("Transporter created successfully");
    return transporter;
  } catch (error) {
    console.error("Error creating transporter:", error);
    console.error("Error stack:", error.stack);
    throw error;
  }
};

// Helper: Generate JWT
const generateToken = (user) => {
  console.log("[JWT SIGN] JWT_SECRET in use:", JWT_SECRET);
  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      username: user.username,
      role: user.role,
      profileComplete: user.profileComplete,
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
    }
  );
  console.log("[JWT SIGN] Token generated:", token);
  return token;
};

const generateRandomUsername = async (email) => {
  const prefix = (email ? email.split("@")[0] : "user")
    .replace(/[^a-zA-Z0-9_]/g, "_")
    .slice(0, 12);
  let username;
  let exists = true;
  while (exists) {
    username = `${prefix}${Math.floor(1000 + Math.random() * 9000)}`;
    exists = await User.findOne({ username });
  }
  return username;
};

// POST /api/auth/signup
const signUp = async (req, res) => {
  try {
    console.log("Signup request received:", {
      email: req.body.email,
      username: req.body.username,
    });

    const { email, password, username } = req.body;
    if (!email || !password) {
      console.log("Missing email or password");
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    console.log("Validating username...");
    let finalUsername = username;
    let profileComplete = true;
    if (!username) {
      // Try up to 5 times to avoid rare race conditions
      let attempts = 0;
      while (attempts < 5) {
        finalUsername = await generateRandomUsername(email);
        const existingUser = await User.findOne({ username: finalUsername });
        if (!existingUser) break;
        attempts++;
      }
      profileComplete = false;
    } else {
      // Username validation (3-20 chars, alphanumeric/underscore)
      const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
      if (!usernameRegex.test(username)) {
        console.log("Invalid username format");
        return res.status(400).json({
          message:
            "Username must be 3-20 characters and contain only letters, numbers, and underscores.",
        });
      }
    }

    console.log("Checking for existing user...");
    const existingUser = await User.findOne({
      $or: [{ email }, { username: finalUsername }],
    });
    if (existingUser) {
      if (existingUser.email === email) {
        console.log("User with email already exists");
        return res
          .status(409)
          .json({ message: "User with this email already exists." });
      }
      if (existingUser.username === finalUsername) {
        console.log("Username already taken");
        return res.status(409).json({ message: "Username is already taken." });
      }
    }

    console.log("Creating new user...");
    let user;
    try {
      // Generate OTP (6 digits)
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      user = new User({
        email,
        password,
        username: finalUsername,
        role: "user",
        profileComplete,
        emailVerified: false,
        otp,
        otpExpires,
      });
      await user.save();
      console.log("User saved successfully");

      // Send OTP email
      console.log("Preparing to send OTP email...");
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Verify your email address - Zencode",
        html: `
          <h2>Welcome to Zencode!</h2>
          <p>Your verification code is:</p>
          <h1 style="font-size: 32px; color: #007bff; text-align: center; letter-spacing: 8px; font-weight: bold; margin: 20px 0;">${otp}</h1>
          <p>Enter this code on the verification page to complete your registration.</p>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't create an account, please ignore this email.</p>
        `,
      };

      console.log("Creating email transporter...");
      const transporter = await createTransporter();
      console.log("Sending OTP email...");
      await transporter.sendMail(mailOptions);
      console.log("OTP email sent successfully");

      res.status(201).json({
        message:
          "Account created successfully. Please check your email for the verification code.",
        email: email, // Return email for frontend to use in OTP verification
      });
    } catch (err) {
      console.error("Error in user creation/email sending:", err);
      // Handle duplicate username error (race condition)
      if (err.code === 11000 && err.keyPattern && err.keyPattern.username) {
        return res
          .status(409)
          .json({ message: "Username is already taken. Please try again." });
      }
      throw err;
    }
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// POST /api/auth/signin
const signIn = async (req, res) => {
  try {
    console.log("Signin request received:", { email: req.body.email });

    const { email, password } = req.body;
    if (!email || !password) {
      console.log("Missing email or password in signin request");
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    console.log("Looking for user with email:", email);
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found");
      return res.status(401).json({ message: "Invalid credentials." });
    }

    console.log("User found, checking password...");
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log("Password mismatch");
      return res.status(401).json({ message: "Invalid credentials." });
    }

    console.log("Password verified, checking email verification...");
    console.log("Email verified status:", user.emailVerified);

    // Check if email is verified
    if (!user.emailVerified) {
      console.log("Email not verified, rejecting signin");
      return res.status(401).json({
        message:
          "Please verify your email address before signing in. Check your email for a verification code.",
      });
    }

    console.log("Email verified, generating token...");
    const token = generateToken(user);
    console.log("Token generated successfully");

    res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        emailVerified: user.emailVerified,
      },
    });
  } catch (err) {
    console.error("Signin error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// POST /api/auth/complete-profile
const completeProfile = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { fullName, username } = req.body;
    if (!fullName || !username) {
      return res
        .status(400)
        .json({ message: "Full name and username are required." });
    }
    // Username validation
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      return res.status(400).json({
        message:
          "Username must be 3-20 characters and contain only letters, numbers, and underscores.",
      });
    }
    const existing = await User.findOne({ username });
    if (existing && existing._id.toString() !== userId) {
      return res.status(409).json({ message: "Username is already taken." });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    user.name = fullName;
    user.username = username;
    user.profileComplete = true;
    await user.save();
    const token = generateToken(user);
    res.json({
      message: "Profile completed.",
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        name: user.name,
        profileComplete: user.profileComplete,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// POST /api/auth/verify-otp
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required." });
    }

    const user = await User.findOne({
      email,
      otp,
      otpExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    user.emailVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const jwtToken = generateToken(user);
    res.json({
      message: "Email verified successfully.",
      token: jwtToken,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        emailVerified: user.emailVerified,
        profileComplete: user.profileComplete,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// POST /api/auth/resend-otp
const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.emailVerified) {
      return res.status(400).json({ message: "Email is already verified." });
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Send new OTP email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "New verification code - Zencode",
      html: `
        <h2>New Verification Code</h2>
        <p>Your new verification code is:</p>
        <h1 style="font-size: 32px; color: #007bff; text-align: center; letter-spacing: 8px; font-weight: bold; margin: 20px 0;">${otp}</h1>
        <p>Enter this code on the verification page to complete your registration.</p>
        <p>This code will expire in 10 minutes.</p>
      `,
    };

    const transporter = await createTransporter();
    await transporter.sendMail(mailOptions);
    res.json({ message: "New OTP sent successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  try {
    console.log("Forgot password request received:", { email: req.body.email });

    const { email } = req.body;
    if (!email) {
      console.log("Missing email in forgot password request");
      return res.status(400).json({ message: "Email is required." });
    }

    console.log("Looking for user with email:", email);
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found, sending generic response");
      // Don't reveal if user exists or not
      return res.json({
        message:
          "If an account with that email exists, a password reset link has been sent.",
      });
    }

    console.log("User found, generating reset token...");
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    user.resetToken = resetToken;
    user.resetExpires = resetExpires;
    await user.save();
    console.log("Reset token saved to user");

    // Send reset email
    console.log("Preparing to send reset email...");
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset your password",
      html: `
        <h2>Password Reset Request</h2>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    };

    console.log("Creating email transporter for password reset...");
    const transporter = await createTransporter();
    console.log("Sending password reset email...");
    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent successfully");

    res.json({
      message:
        "If an account with that email exists, a password reset link has been sent.",
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// POST /api/auth/reset-password
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res
        .status(400)
        .json({ message: "Token and password are required." });
    }

    const user = await User.findOne({
      resetToken: token,
      resetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token." });
    }

    user.password = password;
    user.resetToken = undefined;
    user.resetExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET /api/auth/validate-reset-token/:token
const validateResetToken = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({
      resetToken: token,
      resetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token." });
    }

    res.json({ message: "Token is valid." });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// POST /api/auth/resend-verification
const resendVerification = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.emailVerified) {
      return res.status(400).json({ message: "Email is already verified." });
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    user.verificationToken = verificationToken;
    user.verificationExpires = verificationExpires;
    await user.save();

    // Send verification email
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Verify your email address",
      html: `
        <h2>Email Verification</h2>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verificationUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
      `,
    };

    const transporter = await createTransporter();
    await transporter.sendMail(mailOptions);
    res.json({ message: "Verification email sent successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  signUp,
  signIn,
  completeProfile,
  verifyOTP,
  resendOTP,
  forgotPassword,
  resetPassword,
  validateResetToken,
  resendVerification,
};
