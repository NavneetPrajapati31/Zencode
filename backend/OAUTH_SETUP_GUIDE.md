# Google OAuth Setup Guide for Zencode

This guide will help you fix the `invalid_grant` error by setting up proper Google OAuth credentials for email functionality.

## Current Issue

The error `Error creating transporter: GaxiosError: invalid_grant` indicates that your Google OAuth refresh token is either:

- Expired
- Revoked
- Invalid
- Doesn't match the OAuth client credentials

## Step-by-Step Solution

### 1. Access Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Create a new project or select an existing one

### 2. Enable Gmail API

1. In the left sidebar, click "APIs & Services" > "Library"
2. Search for "Gmail API"
3. Click on "Gmail API" and then click "Enable"

### 3. Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. If prompted, configure the OAuth consent screen first:
   - Choose "External" user type
   - Fill in required fields (App name, User support email, Developer contact)
   - Add scopes: `https://www.googleapis.com/auth/gmail.send`
   - Add test users if needed
4. Back to credentials, choose "Web application"
5. Add authorized redirect URIs:
   - `https://developers.google.com/oauthplayground` (for testing only)
   - `https://your-app-name.vercel.app/api/auth/google/callback` (production)
   - `https://yourdomain.com/api/auth/google/callback` (if custom domain)
6. Click "Create"
7. **Save the Client ID and Client Secret** - you'll need these

### 4. Generate Refresh Token

**Option A: Using OAuth Playground (for testing)**

1. Go to [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)
2. Click the settings icon (⚙️) in the top right corner
3. Check "Use your own OAuth credentials"
4. Enter your Client ID and Client Secret from step 3
5. Click "Close"
6. In the left panel, scroll down and select "Gmail API v1"
7. Select `https://www.googleapis.com/auth/gmail.send`
8. Click "Authorize APIs"
9. Sign in with the Gmail account you want to use for sending emails
10. Grant the requested permissions
11. Click "Exchange authorization code for tokens"
12. **Copy the refresh token** - this is what you need for your environment variables

**Option B: Production OAuth Flow (recommended for production)**

1. Use your production OAuth callback URL: `https://your-app-name.vercel.app/api/auth/google/callback`
2. The refresh token will be generated when users authenticate through your app
3. Store this token securely for email functionality

### 5. Update Environment Variables

Set these environment variables in your deployment platform (Vercel, etc.):

```bash
GOOGLE_EMAIL_CLIENT_ID=your_client_id_here
GOOGLE_EMAIL_CLIENT_SECRET=your_client_secret_here
GOOGLE_REFRESH_TOKEN=your_refresh_token_here
EMAIL_USER=your_gmail_address@gmail.com
```

### 6. For Vercel Deployment

1. Go to your Vercel project dashboard
2. Click on "Settings" > "Environment Variables"
3. Add each variable:
   - `GOOGLE_EMAIL_CLIENT_ID`
   - `GOOGLE_EMAIL_CLIENT_SECRET`
   - `GOOGLE_REFRESH_TOKEN`
   - `EMAIL_USER`
   - `FRONTEND_URL=https://your-app-name.vercel.app`
4. Redeploy your application

### 7. Production OAuth Setup

**For User Authentication (not email):**

- Your OAuth routes are already set up correctly
- Users will authenticate through: `/api/auth/google` and `/api/auth/github`
- Callbacks are handled at: `/api/auth/google/callback` and `/api/auth/github/callback`

**For Email Functionality:**

- You still need the Gmail API refresh token for sending emails
- This is separate from user OAuth authentication
- Use the OAuth Playground method to generate the email refresh token

## Important Notes

### Security

- **Never commit OAuth credentials to version control**
- Use environment variables for all sensitive data
- Regularly rotate your refresh tokens

### Token Expiration

- Refresh tokens can expire if not used for 6 months
- They can be revoked by the user or Google
- Keep your OAuth consent screen active

### Scopes

- The `gmail.send` scope is sufficient for sending emails
- Don't request unnecessary scopes

## Troubleshooting

### Common Issues

1. **"invalid_grant" error persists**:
   - Double-check that Client ID, Client Secret, and Refresh Token match
   - Ensure the Gmail account used for authorization matches EMAIL_USER
   - Verify the OAuth consent screen is properly configured

2. **"access_denied" error**:
   - Check that the Gmail account has granted permissions
   - Ensure the OAuth consent screen is published or you're a test user

3. **"redirect_uri_mismatch"**:
   - Verify the redirect URI in OAuth credentials matches exactly
   - Check for trailing slashes or protocol mismatches

### Testing

After setup, test the email functionality:

1. Try to sign up a new user
2. Check if verification emails are sent
3. Monitor your server logs for any OAuth errors

## Alternative Solutions

If OAuth continues to cause issues, consider:

1. **App Passwords**: Use Gmail app passwords instead of OAuth
2. **SMTP with 2FA**: Configure Gmail SMTP with 2-factor authentication
3. **Third-party email services**: Services like SendGrid, Mailgun, or AWS SES

## Support

If you continue to experience issues:

1. Check Google Cloud Console for any error messages
2. Verify your OAuth consent screen status
3. Ensure your Google Cloud project has billing enabled (if required)
4. Check the [Google OAuth documentation](https://developers.google.com/identity/protocols/oauth2)

---

**Last Updated**: $(date)
**Version**: 1.0
