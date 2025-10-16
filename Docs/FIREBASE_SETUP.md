# Firebase Setup Guide

## Overview
This document provides complete instructions for properly configuring Firebase for both frontend and backend components of the Company Registration System.

## Prerequisites
- Firebase project created in Firebase Console
- Firebase service account key file
- Valid API key with proper permissions

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter project name (e.g., "company-registration")
4. Accept default settings and click "Create Project"

## Step 2: Enable Authentication Providers

1. In Firebase Console, select your project
2. Click "Authentication" in the left sidebar
3. Click "Get started"
4. Click "Sign-in method" tab
5. Enable the following providers:
   - Email/Password
   - Google (optional)
   - Facebook (optional)

## Step 3: Frontend Configuration

### Obtain Web App Configuration

1. In Firebase Console, click the gear icon (Project Settings)
2. Navigate to the "General" tab
3. Under "Your apps", click the web icon (</>) to create a new web app
4. Enter app name (e.g., "Company Registration Frontend")
5. Check "Also set up Firebase Hosting" (optional)
6. Click "Register app"
7. Copy the Firebase configuration object

### Update Frontend Environment Variables

Create or update the `.env` file in the `frontend` directory with the following variables:

```env
# Firebase configuration (replace with your actual values)
VITE_FIREBASE_API_KEY=your_actual_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890abcdef
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# API Configuration
VITE_API_BASE_URL=http://localhost:3001/api
```

### Required API Key Permissions

Ensure your API key has the following permissions enabled in Google Cloud Console:
- Firebase Realtime Database API
- Firebase Authentication API
- Firebase Cloud Messaging API
- Firebase Installations API

## Step 4: Backend Configuration

### Obtain Service Account Key

1. In Firebase Console, click the gear icon (Project Settings)
2. Navigate to the "Service accounts" tab
3. Click "Generate new private key"
4. Click "Generate key"
5. Save the JSON file to your project root as `company-registration-5e650-firebase-adminsdk-fbsvc-050ee55149.json`

### Update Backend Environment Variables

Update the `.env` file in the `backend` directory with the following variables:

```env
# Server Configuration
PORT=3001

# JWT Configuration
JWT_SECRET=company_registration_jwt_secret_key
JWT_EXPIRES_IN=90d

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=company_registration
DB_USER=postgres
DB_PASSWORD=your_password

# Firebase Configuration (extract from service account JSON)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_CLIENT_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/your-service-account%40your-project.iam.gserviceaccount.com

# Cloudinary Configuration (if using)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Implementation Details

### Frontend Implementation
1. **Firebase Initialization**: Located in `frontend/src/services/firebase.js`
2. **Authentication Components**: 
   - `CompanyAuth.jsx` handles registration and login
   - `FirebaseTest.jsx` for debugging and verification
3. **API Integration**: `frontend/src/services/api.js` includes Firebase login endpoint

### Backend Implementation
1. **Firebase Admin Initialization**: Located in `backend/utils/firebase.js`
2. **Authentication Controller**: `authController.js` includes `firebaseLogin` function
3. **Authentication Routes**: `/api/auth/firebase-login` endpoint

## Key Features

### User Registration Flow
1. User registers through frontend form
2. Firebase creates user account
3. Frontend gets Firebase ID token
4. Token sent to backend `/api/auth/firebase-login`
5. Backend verifies token and creates user in local database
6. Backend returns JWT for application authentication

### User Login Flow
1. User logs in through frontend form
2. Firebase authenticates credentials
3. Frontend gets Firebase ID token
4. Token sent to backend `/api/auth/firebase-login`
5. Backend verifies token and returns user data with JWT

## Step 5: Verify Configuration

### Test Frontend Firebase Integration

1. Start the frontend server: `npm run dev`
2. Navigate to `http://localhost:5173/firebase-test`
3. Check the browser console for any errors
4. Confirm that Firebase initializes successfully

### Test Backend Firebase Integration

1. Start the backend server: `npm run dev` (from backend directory)
2. Check the console for "Firebase Admin initialized successfully" message
3. If you see "Firebase Admin not initialized - missing or invalid environment variables", check your environment configuration

## Troubleshooting

### Common Error: "400 INVALID_ARGUMENT: API key not valid"

This error typically occurs when:
1. The API key is incorrect or has been revoked
2. The API key doesn't have the necessary permissions
3. There's a mismatch between project IDs in frontend and backend configurations

Resolution Steps:
1. Verify the API key in Firebase Console
2. Check that the API key has the required permissions
3. Ensure project IDs match between frontend and backend
4. Restart the development servers after making changes

### Common Error: "auth/operation-not-allowed"

This error occurs when the required sign-in provider is not enabled in Firebase Console.

Resolution Steps:
1. Go to Firebase Console → Authentication → Sign-in method
2. Enable the Email/Password provider
3. Save changes

### Common Error: "Firebase Admin not initialized"

This error occurs when the backend cannot find or parse the service account key.

Resolution Steps:
1. Ensure the service account JSON file is in the project root
2. Verify all environment variables in backend/.env are correctly set
3. Check that the private key is properly formatted with \n characters

### Common Issues

1. **Firebase users not showing up**
   - Verify Email/Password provider is enabled in Firebase Console
   - Check environment variables are correctly set
   - Ensure service account key is properly formatted

2. **Authentication errors**
   - Check browser console for specific error messages
   - Verify API key has proper permissions
   - Ensure project IDs match between frontend and backend

3. **Initialization failures**
   - Check all required environment variables are present
   - Verify private key formatting (newlines properly escaped)
   - Confirm service account has proper permissions

### Error Codes

- `auth/operation-not-allowed`: Enable Email/Password provider in Firebase Console
- `auth/invalid-api-key`: Check Firebase API key in environment variables
- `auth/network-request-failed`: Check network connectivity
- `admin/auth/invalid-credential`: Check service account key formatting

## Security Notes

- Never commit actual API keys to version control
- Use environment variables for all sensitive configuration
- Rotate API keys regularly for security
- Restrict API key usage by domain/IP when possible
- Keep your service account key file secure and never expose it publicly

## Security Considerations

1. **Frontend**: Only public API keys are exposed
2. **Backend**: Service account key is securely stored in environment variables
3. **Communication**: Firebase ID tokens are sent over HTTPS
4. **Data Sync**: User data is synchronized between Firebase and local database

## Testing Firebase Authentication

1. Register a new user using the registration form
2. Check that the user appears in Firebase Console → Authentication → Users
3. Log in with the same user credentials
4. Verify that the user can access protected routes
5. Check that the user data is properly stored in your PostgreSQL database

## Debugging Tips

1. Enable Firebase logging by adding `console.log` statements in firebase.js
2. Check browser console for Firebase initialization errors
3. Check backend console for Firebase Admin errors
4. Use the Firebase Test component at `/firebase-test` to debug frontend issues
5. Verify environment variables are loaded correctly in both frontend and backend

## Next Steps

1. Implement additional Firebase features (e.g., email verification)
2. Add social authentication providers
3. Implement Firebase Cloud Messaging for notifications
4. Set up Firebase Analytics for user behavior tracking