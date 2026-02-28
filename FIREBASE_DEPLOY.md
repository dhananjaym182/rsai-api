# NexusChat - Firebase Deployment Guide

## Prerequisites
1. Create a Firebase project at https://console.firebase.google.com
2. Install Firebase CLI: `npm install -g firebase-tools`

## Setup Steps

### 1. Configure Firebase Project
Edit `.firebaserc` and replace `your-project-id` with your actual Firebase project ID:
```json
{
  "projects": {
    "default": "your-actual-project-id"
  }
}
```

### 2. Login to Firebase
```bash
firebase login
```

### 3. Build the Application
```bash
npm run build
```

This will create a static export in the `out/` directory.

### 4. Deploy to Firebase Hosting
```bash
firebase deploy --only hosting
```

## Configuration Files

### firebase.json
- Configured for static hosting
- Serves from `out/` directory
- Includes cache headers for static assets
- SPA routing configured

### next.config.ts
- `output: 'export'` - Enables static export
- `images.unoptimized: true` - Required for static export
- `trailingSlash: true` - Better compatibility with Firebase Hosting

## Important Notes

⚠️ **Client-Side Only**: This is a static export, so all API calls happen client-side. Your API keys are encrypted in localStorage but never sent to any server.

⚠️ **CORS**: Some AI providers may require CORS configuration. If you encounter CORS issues, you may need to set up a simple proxy using Firebase Functions.

## Deployment Commands

```bash
# Build and deploy
npm run build && firebase deploy

# Deploy only hosting
firebase deploy --only hosting

# Preview before deploying
firebase hosting:channel:deploy preview
```

## Post-Deployment

After deployment, your app will be available at:
- `https://your-project-id.web.app`
- `https://your-project-id.firebaseapp.com`

You can also set up a custom domain in the Firebase Console under Hosting settings.
