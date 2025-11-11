# SETUP GUIDE: Getting Your Google Client ID

## Step 1: Create a Google Cloud Project

1. Go to: https://console.cloud.google.com/
2. Click "Select a project" → "New Project"
3. Name it (e.g., "Photos Live Converter")
4. Click "Create"

## Step 2: Enable Google Photos Library API

1. In the Google Cloud Console, go to: https://console.cloud.google.com/apis/library
2. Search for "Google Photos Library API"
3. Click on it
4. Click "Enable"

## Step 3: Create OAuth 2.0 Credentials

1. Go to: https://console.cloud.google.com/apis/credentials
2. Click "Create Credentials" → "OAuth client ID"
3. If prompted to configure consent screen:
   - Click "Configure Consent Screen"
   - Choose "External"
   - Fill in required fields:
     - App name: Google Photos Live Converter
     - User support email: your email
     - Developer contact: your email
   - Click "Save and Continue"
   - Skip "Scopes" (click "Save and Continue")
   - Add yourself as a test user
   - Click "Save and Continue"

4. Back to "Create OAuth client ID":
   - Application type: **Web application**
   - Name: Photos Live Converter
   - Authorized JavaScript origins:
     - Click "Add URI"
     - Add: `http://localhost:5173`
   - Authorized redirect URIs:
     - Click "Add URI"
     - Add: `http://localhost:5173`
   - Click "Create"

5. **Copy the Client ID** (it looks like: `123456789-abc123.apps.googleusercontent.com`)

## Step 4: Add to Your .env File

1. Open `/home/user/cracklist-game/.env`
2. Replace the placeholder:
   ```
   VITE_GOOGLE_CLIENT_ID=YOUR-ACTUAL-CLIENT-ID.apps.googleusercontent.com
   ```
3. Save the file

## Step 5: Restart the Dev Server

```bash
# Kill the current server (Ctrl+C)
# Then restart:
npm run dev
```

Now the "Sign in with Google" button should work!

## Troubleshooting

**Error: "redirect_uri_mismatch"**
- Make sure `http://localhost:5173` is in BOTH:
  - Authorized JavaScript origins
  - Authorized redirect URIs

**Error: "Access blocked: This app's request is invalid"**
- Make sure Google Photos Library API is enabled
- Add yourself as a test user in OAuth consent screen

**Still not working?**
- Clear browser cache
- Try incognito/private browsing mode
- Check the browser console (F12) for detailed errors
