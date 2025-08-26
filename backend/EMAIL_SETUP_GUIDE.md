# Email Setup Guide for Zencode

This guide provides solutions for the OAuth authentication errors you're experiencing and offers alternative email authentication methods.

## Current Issue

You're getting this error:

```
OAuth token refresh failed: Error: Invalid login: 535-5.7.8 Username and Password not accepted
```

This indicates that even with regenerated OAuth credentials, the authentication is still failing.

## Solution 1: App Password (Recommended)

App passwords are more reliable than OAuth for email sending and don't expire.

### Step 1: Enable 2-Factor Authentication

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable "2-Step Verification" if not already enabled

### Step 2: Generate App Password

1. In the same security page, find "App passwords"
2. Click "App passwords"
3. Select "Mail" as the app
4. Select "Other (Custom name)" as device
5. Enter a name like "Zencode Email Service"
6. Click "Generate"
7. **Copy the 16-character app password** (e.g., `abcd efgh ijkl mnop`)

### Step 3: Update Environment Variables

Add this to your Vercel environment variables:

```
GMAIL_APP_PASSWORD=your_16_character_app_password
```

**Remove spaces** from the app password when setting it.

### Step 4: Redeploy

After adding the environment variable, redeploy your backend.

## Solution 2: Fix OAuth (Alternative)

If you prefer to use OAuth, here's how to properly set it up:

### Step 1: Verify OAuth Consent Screen

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to "APIs & Services" > "OAuth consent screen"
4. Ensure it's published or you're a test user
5. Verify scopes include `https://www.googleapis.com/auth/gmail.send`

### Step 2: Check OAuth Credentials

1. Go to "APIs & Services" > "Credentials"
2. Find your OAuth 2.0 Client ID
3. Ensure it's for "Web application"
4. Check authorized redirect URIs

### Step 3: Generate New Refresh Token

1. Go to [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)
2. Click settings (⚙️) and check "Use your own OAuth credentials"
3. Enter your Client ID and Client Secret
4. Select "Gmail API v1" → `https://www.googleapis.com/auth/gmail.send`
5. Click "Authorize APIs"
6. Sign in with the **same Gmail account** as your `EMAIL_USER`
7. Click "Exchange authorization code for tokens"
8. Copy the refresh token

### Step 4: Verify Environment Variables

Ensure these are set correctly in Vercel:

```
GOOGLE_EMAIL_CLIENT_ID=your_client_id
GOOGLE_EMAIL_CLIENT_SECRET=your_client_secret
GOOGLE_REFRESH_TOKEN=your_refresh_token
EMAIL_USER=your_gmail_address@gmail.com
```

**Important**: The Gmail account used for OAuth authorization must match your `EMAIL_USER`.

## Solution 3: Debug OAuth Issues

The enhanced logging in the updated code will show you exactly what's happening:

### Check Logs

Look for these log messages in your Vercel function logs:

```
[EMAIL] Environment variables check:
[EMAIL] EMAIL_USER: SET/NOT SET
[EMAIL] GOOGLE_EMAIL_CLIENT_ID: SET/NOT SET
[EMAIL] GOOGLE_EMAIL_CLIENT_SECRET: SET/NOT SET
[EMAIL] GOOGLE_REFRESH_TOKEN: SET/NOT SET
[EMAIL] GMAIL_APP_PASSWORD: SET/NOT SET
```

### Common Issues

1. **Mismatched accounts**: OAuth account ≠ EMAIL_USER
2. **Expired refresh token**: Regenerate if not used for 6+ months
3. **Wrong scopes**: Must include `gmail.send`
4. **OAuth consent screen**: Must be published or you must be a test user

## Testing

After setup, test email functionality:

1. Try to sign up a new user
2. Check Vercel function logs for email-related messages
3. Look for verification emails in the user's inbox

## Environment Variables Summary

### Required for App Password:

```
EMAIL_USER=your_gmail@gmail.com
GMAIL_APP_PASSWORD=your_16_char_app_password
```

### Required for OAuth:

```
EMAIL_USER=your_gmail@gmail.com
GOOGLE_EMAIL_CLIENT_ID=your_client_id
GOOGLE_EMAIL_CLIENT_SECRET=your_client_secret
GOOGLE_REFRESH_TOKEN=your_refresh_token
```

### Optional:

```
FRONTEND_URL=https://your-app.vercel.app
```

## Recommendation

**Use App Password (Solution 1)** because:

- More reliable than OAuth
- No token expiration
- Simpler setup
- Fewer points of failure

OAuth is great for user authentication but can be problematic for service-to-service email sending.

## Support

If you continue having issues:

1. Check Vercel function logs for detailed error messages
2. Verify all environment variables are set correctly
3. Ensure the Gmail account has 2FA enabled (for app passwords)
4. Check that the OAuth consent screen is properly configured (for OAuth)
