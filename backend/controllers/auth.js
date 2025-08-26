const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { GoogleAuth } = require("google-auth-library");

// Environment variable checks for production/development
const isProduction = process.env.NODE_ENV === "production";

const requiredEnv = [
  "JWT_SECRET",
  "EMAIL_USER",
  "GOOGLE_EMAIL_CLIENT_ID",
  "GOOGLE_EMAIL_CLIENT_SECRET",
  "GOOGLE_REFRESH_TOKEN",
  "FRONTEND_URL",
];

let JWT_SECRET =
  process.env.JWT_SECRET ||
  "935dacfee06f8c8bcf458d9fcab55704d0ceaa6a94e05d68796f9905855282f5a67d8322e305b2b970baebaa4507d4837157f2829c737547a779c4558e9de3c5";
if (isProduction) {
  for (const key of requiredEnv) {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }
} else {
  // Development: allow fallbacks, but warn
  if (!JWT_SECRET) {
    console.warn(
      "[DEV WARNING] JWT_SECRET not set, using insecure fallback. DO NOT USE IN PRODUCTION."
    );
    JWT_SECRET =
      process.env.JWT_SECRET ||
      "935dacfee06f8c8bcf458d9fcab55704d0ceaa6a94e05d68796f9905855282f5a67d8322e305b2b970baebaa4507d4837157f2829c737547a779c4558e9de3c5";
  }
  for (const key of requiredEnv) {
    if (!process.env[key]) {
      console.warn(`[DEV WARNING] ${key} not set. Some features may not work.`);
    }
  }
}

const JWT_EXPIRES_IN = "7d";

// Email configuration with OAuth2
const createTransporter = async () => {
  try {
    if (!GoogleAuth) {
      throw new Error("Google auth library not properly imported");
    }
    const { OAuth2Client } = require("google-auth-library");
    const clientId = process.env.GOOGLE_EMAIL_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_EMAIL_CLIENT_SECRET;
    const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
    const user = process.env.EMAIL_USER;

    if (isProduction) {
      if (!clientId || !clientSecret || !refreshToken || !user) {
        throw new Error("Missing email credentials for production");
      }
    } else {
      if (!clientId || !clientSecret || !refreshToken || !user) {
        console.warn(
          "[DEV WARNING] Email credentials missing. Emails will not be sent."
        );
        throw new Error(
          "Email credentials missing in development. Email sending is disabled."
        );
      }
    }

    // Create OAuth2Client without hardcoded redirect URI
    const oauth2Client = new OAuth2Client(clientId, clientSecret);

    // Set credentials with refresh token
    oauth2Client.setCredentials({
      refresh_token: refreshToken,
    });

    try {
      // Get access token
      const accessToken = await oauth2Client.getAccessToken();

      // Create transporter
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: user,
          clientId: clientId,
          clientSecret: clientSecret,
          refreshToken: refreshToken,
          accessToken: accessToken.token, // Access the token property
        },
      });

      // Verify transporter configuration
      await transporter.verify();

      return transporter;
    } catch (oauthError) {
      console.error("OAuth token refresh failed:", oauthError);

      // Provide more specific error messages
      if (
        oauthError.code === 400 &&
        oauthError.response?.data?.error === "invalid_grant"
      ) {
        throw new Error(
          "OAuth refresh token is invalid or expired. Please regenerate your OAuth credentials and refresh token."
        );
      }

      throw new Error(`OAuth authentication failed: ${oauthError.message}`);
    }
  } catch (error) {
    console.error("Error creating transporter:", error);
    throw error;
  }
};

// Helper: Generate JWT
const generateToken = (user) => {
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
    const { email, password, username } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    let finalUsername = username;
    let profileComplete = true;
    if (!username) {
      let attempts = 0;
      while (attempts < 5) {
        finalUsername = await generateRandomUsername(email);
        const existingUser = await User.findOne({ username: finalUsername });
        if (!existingUser) break;
        attempts++;
      }
      profileComplete = false;
    } else {
      const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
      if (!usernameRegex.test(username)) {
        return res.status(400).json({
          message:
            "Username must be 3-20 characters and contain only letters, numbers, and underscores.",
        });
      }
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username: finalUsername }],
    });
    if (existingUser) {
      if (existingUser.email === email) {
        return res
          .status(409)
          .json({ message: "User with this email already exists." });
      }
      if (existingUser.username === finalUsername) {
        return res.status(409).json({ message: "Username is already taken." });
      }
    }

    let user;
    try {
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

      try {
        const transporter = await createTransporter();
        await transporter.sendMail(mailOptions);

        res.status(201).json({
          message:
            "Account created successfully. Please check your email for the verification code.",
          email: email, // Return email for frontend to use in OTP verification
        });
      } catch (emailError) {
        console.error("Email sending failed:", emailError);

        // If email fails, still create the user but inform about email issue
        if (
          emailError.message.includes("OAuth refresh token is invalid") ||
          emailError.message.includes("OAuth authentication failed")
        ) {
          // Delete the user since email verification is required
          await User.findByIdAndDelete(user._id);

          return res.status(500).json({
            message:
              "Account creation failed due to email service configuration issue. Please contact support.",
            error: "Email service unavailable",
          });
        }

        // For other email errors, still create user but warn about email
        console.warn(
          "User created but email verification failed:",
          emailError.message
        );

        res.status(201).json({
          message:
            "Account created successfully, but email verification failed. Please contact support to verify your email.",
          email: email,
          warning: "Email verification service temporarily unavailable",
        });
      }
    } catch (err) {
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
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    if (!user.emailVerified) {
      return res.status(401).json({
        message:
          "Please verify your email address before signing in. Check your email for a verification code.",
      });
    }

    const token = generateToken(user);

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

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

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
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        message:
          "If an account with that email exists, a password reset link has been sent.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    user.resetToken = resetToken;
    user.resetExpires = resetExpires;
    await user.save();

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

    const transporter = await createTransporter();
    await transporter.sendMail(mailOptions);

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

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    user.verificationToken = verificationToken;
    user.verificationExpires = verificationExpires;
    await user.save();

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
