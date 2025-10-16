# Project Startup Guide

## Prerequisites
- Node.js installed
- PostgreSQL database (optional, for full functionality)

## Starting the Project

### 1. Start the Backend Server

Open a new terminal and run:
```bash
cd backend
npm start
```

Or if you prefer to run with node directly:
```bash
cd backend
node server.js
```

The backend server will start on port 5002.

### 2. Start the Frontend Development Server

Open another terminal and run:
```bash
cd frontend
npm run dev
```

The frontend development server will start on port 5173.

### 3. Access the Application

Once both servers are running:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5002/api
- Firebase Test Page: http://localhost:5173/firebase-test

## Firebase Configuration Verification

To verify your Firebase setup is working correctly:
1. Navigate to http://localhost:5173/firebase-test
2. Check the browser console for any errors
3. Confirm that Firebase initializes successfully

## Testing User Authentication

1. Go to http://localhost:5173/register
2. Create a new user account
3. Check that the user appears in your Firebase Console → Authentication → Users
4. Log in with the same credentials
5. Verify that you can access protected routes

## Troubleshooting

### Port Conflicts
If you encounter port conflicts:
1. Check what's using the port: `netstat -ano | findstr :5002`
2. Kill the process: `taskkill /PID <process_id> /F`
3. Or change the PORT value in `backend/.env`

### Firebase Issues
If Firebase isn't working:
1. Verify all environment variables are correctly set
2. Check that the Email/Password provider is enabled in Firebase Console
3. Ensure your service account key is properly formatted

### Database Issues
If you see database connection errors:
1. Make sure PostgreSQL is running
2. Verify database credentials in `backend/.env`
3. Create the database if it doesn't exist

## Environment Variables

### Backend (.env)
- PORT: Server port (default: 5002)
- JWT_SECRET: Secret key for JWT tokens
- DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD: PostgreSQL configuration
- FIREBASE_*: Firebase service account configuration

### Frontend (.env)
- VITE_FIREBASE_*: Firebase web app configuration
- VITE_API_BASE_URL: Backend API URL

## Next Steps

1. Implement your company registration forms
2. Set up your PostgreSQL database for full functionality
3. Customize the UI components to match your branding
4. Add additional features as needed