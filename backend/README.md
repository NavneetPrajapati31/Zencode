# Backend Setup Instructions

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/zencode

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# Email Configuration (for Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Frontend URL
FRONTEND_URL=http://localhost:5173

# OAuth Configuration
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Server Configuration
PORT=5000
NODE_ENV=development
```

## Email Setup

For Gmail, you'll need to:

1. Enable 2-factor authentication
2. Generate an App Password
3. Use the App Password as EMAIL_PASS

## New Authentication Features

### Email Verification

- Users must verify their email before signing in
- Verification tokens expire in 24 hours
- Users can request new verification emails

### Password Reset

- Users can request password reset via email
- Reset tokens expire in 1 hour
- Secure token validation

### API Endpoints

#### Email Verification

- `POST /api/auth/verify-email` - Verify email with token
- `POST /api/auth/resend-verification` - Resend verification email (requires auth)

#### Password Reset

- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `GET /api/auth/validate-reset-token/:token` - Validate reset token

## Installation

```bash
npm install
npm install nodemailer
```

## Running the Server

### Local Development

```bash
npm start
```

### Production Deployment

#### Option 1: Vercel (Recommended)

1. **Quick Deploy**: Run the deployment script

   ```bash
   # Windows
   deploy.bat

   # Linux/Mac
   ./deploy.sh
   ```

2. **Manual Deploy**: Follow the [Vercel Deployment Guide](VERCEL_DEPLOYMENT.md)

3. **Environment Variables**: Use `env.template` as a reference for required variables

#### Option 2: Traditional Hosting

```bash
npm run build
npm start
```

## Deployment Files

- `vercel.json` - Vercel configuration
- `.vercelignore` - Files to exclude from deployment
- `api/index.js` - Serverless entry point for Vercel
- `VERCEL_DEPLOYMENT.md` - Comprehensive deployment guide
- `env.template` - Environment variables template
- `deploy.bat` / `deploy.sh` - Automated deployment scripts

## Project Structure

```
backend/
├── api/
│   └── index.js          # Main serverless entry point
├── config/               # Database configuration
├── controllers/          # API controllers
├── middleware/           # Authentication middleware
├── models/              # MongoDB models
├── routes/              # API routes
├── vercel.json          # Vercel configuration
├── .vercelignore        # Files to exclude from deployment
├── env.template         # Environment variables template
├── deploy.bat           # Windows deployment script
├── deploy.sh            # Linux/Mac deployment script
└── package.json         # Dependencies and scripts
```
