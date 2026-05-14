# Production Setup Guide

## Required Environment Variables

For NextAuth.js to work correctly in production, ensure these environment variables are set:

### 1. Authentication Configuration

```bash
# Required: Secret key for JWT encryption (generate a random string)
AUTH_SECRET="your-random-secret-key-here"

# Required: Base URL of your application
AUTH_URL="https://sharecard.co.in"

# Optional: Public app URL (used as fallback)
NEXT_PUBLIC_APP_URL="https://sharecard.co.in"
```

### 2. Google OAuth Configuration

```bash
# Required: Google OAuth Client ID
AUTH_GOOGLE_ID="your-google-client-id"

# Required: Google OAuth Client Secret
AUTH_GOOGLE_SECRET="your-google-client-secret"
```

**Important:** In Google Cloud Console, ensure the authorized redirect URI is set to:
```
https://sharecard.co.in/api/auth/callback/google
```

### 3. Database Configuration

```bash
DB_HOST="127.0.0.1"
DB_PORT="3306"
DB_USER="sharecard"
DB_PASSWORD="your-database-password"
DB_NAME="sharecard"
DB_SYNC="false"
```

## Generating AUTH_SECRET

You can generate a secure AUTH_SECRET using:

```bash
# Using OpenSSL
openssl rand -base64 32

# Or using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Troubleshooting Login Issues

### Error: "There is a problem with the server configuration"

1. **Check AUTH_SECRET is set:**
   ```bash
   echo $AUTH_SECRET
   ```
   If empty, set it in your production environment.

2. **Check AUTH_URL matches your domain:**
   ```bash
   echo $AUTH_URL
   ```
   Should be `https://sharecard.co.in` (no trailing slash)

3. **Verify Google OAuth credentials:**
   - Check `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET` are set
   - Verify redirect URI in Google Cloud Console matches exactly: `https://sharecard.co.in/api/auth/callback/google`

4. **Check database connection:**
   - Verify database credentials are correct
   - Ensure database is accessible from your server
   - Check firewall rules allow connections

5. **Check server logs:**
   - Look for error messages starting with `❌` in your application logs
   - Check for database connection errors
   - Verify all environment variables are loaded

## Common Issues

### Issue: "AUTH_SECRET is missing"
**Solution:** Set the `AUTH_SECRET` environment variable in your production environment.

### Issue: OAuth callback fails
**Solution:** 
- Verify the redirect URI in Google Cloud Console exactly matches: `https://sharecard.co.in/api/auth/callback/google`
- Ensure `AUTH_URL` is set to `https://sharecard.co.in` (no trailing slash)

### Issue: Database connection timeout
**Solution:**
- Verify database host, port, user, and password are correct
- Check firewall rules
- Ensure database server is running and accessible

## Verification

After setting up, check the application logs on startup. You should see:
```
✅ NextAuth Configuration:
   AUTH_URL: https://sharecard.co.in
   AUTH_SECRET: ✓ Set
   AUTH_GOOGLE_ID: ✓ Set
✅ NextAuth Sequelize adapter initialized successfully
✅ Database connection verified
```

If you see `✗ Missing` for any item, that environment variable is not set correctly.
