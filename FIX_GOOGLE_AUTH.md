# Fix Google OAuth 403: access_denied Error

## The Problem

Your app is in "Testing" mode in Google Cloud Console. In testing mode, ONLY explicitly added test users can sign in - even if you're the project owner!

## The Solution

### Step 1: Go to OAuth Consent Screen

1. Open: https://console.cloud.google.com/apis/credentials/consent
2. Make sure you're in the correct project
3. You should see your "Google Photos Live Converter" app

### Step 2: Add Test Users

1. Scroll down to the **"Test users"** section
2. Click **"+ ADD USERS"** button
3. Enter your Gmail address (the one you're trying to sign in with)
4. Click **"Save"**

### Step 3: Try Again

1. Go back to your app: http://localhost:5173/
2. Click "Sign in with Google"
3. It should work now!

## Alternative: Publish the App (Not Recommended for Now)

If you want anyone to use the app without being a test user:

1. Go to OAuth consent screen
2. Click "PUBLISH APP" 
3. WARNING: This requires Google verification if you're using sensitive scopes
4. For testing, just add yourself as a test user instead

## Verify Your Settings

Make sure:
- ✅ OAuth consent screen is configured
- ✅ Your email is in "Test users" list
- ✅ App status shows "Testing"
- ✅ Google Photos Library API is enabled

## Screenshot Guide

**Test Users Section should look like:**
```
Test users
┌─────────────────────────────────────┐
│ + ADD USERS                         │
│                                     │
│ your-email@gmail.com        [X]    │
└─────────────────────────────────────┘
```
