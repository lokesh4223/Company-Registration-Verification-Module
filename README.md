# Company Registration System

A comprehensive platform for company registration and management with user authentication, onboarding, and dashboard features.

## Features

- User authentication (registration, login, password reset)
- Company onboarding process
- Employer dashboard
- Job posting functionality
- Candidate management
- Profile management

## Tech Stack

- Frontend: ReactJS 18.2.0 with Vite
- Backend: Node.js with Express
- Database: PostgreSQL
- Authentication: Firebase Authentication
- Image Storage: Cloudinary
- State Management: Redux Toolkit

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- Firebase Account
- Cloudinary Account (optional)

## Quick Start

For the easiest way to start the project, simply run:
```bash
start-project.bat
```

This will start both the backend and frontend servers in separate terminal windows.

## Manual Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd company-registration
```

### 2. Environment Configuration

#### Frontend Environment Variables

Create `frontend/.env` with the following variables:

```env
# Firebase configuration
VITE_FIREBASE_API_KEY=your_actual_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890abcdef
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# API Configuration
VITE_API_BASE_URL=http://localhost:5002/api
```

#### Backend Environment Variables

Create `backend/.env` with the following variables:

```env
# Server Configuration
PORT=5002

# JWT Configuration
JWT_SECRET=company_registration_jwt_secret_key
JWT_EXPIRES_IN=90d

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=company_registration
DB_USER=postgres
DB_PASSWORD=postgres

# Firebase Configuration
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

### 3. Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Email/Password authentication provider
3. Create a web app and copy the configuration
4. Generate a service account key for the backend
5. Update environment variables with your Firebase configuration

For detailed Firebase setup instructions, see [FIREBASE_SETUP_COMPLETE.md](Docs/FIREBASE_SETUP_COMPLETE.md)

### 4. Database Setup

1. Create a PostgreSQL database named `company_registration`
2. Update database credentials in `backend/.env`
3. Run database migrations:

```bash
cd backend
npm run setup-db
```

4. Set up the jobs table:

```bash
cd backend
npm run setup-jobs
```

### 5. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 6. Run the Application

```bash
# Start backend server
cd backend
npm start

# Start frontend development server (in a new terminal)
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5002/api
- Firebase Test: http://localhost:5173/firebase-test

## Testing

To verify Firebase setup:
1. Start both backend and frontend servers
2. Navigate to `http://localhost:5173/firebase-test`
3. Check the browser console for any errors
4. Confirm that Firebase initializes successfully

## Documentation

- [Project Overview](Docs/PROJECT_OVERVIEW.md)
- [Architecture](Docs/ARCHITECTURE.md)
- [API Specifications](Docs/API_SPECS.md)
- [Database Schema](Docs/DATABASE_SCHEMA.md)
- [Job Posting Functionality](Docs/JOB_POSTING_FUNCTIONALITY.md)
- [Firebase Setup Guide](Docs/FIREBASE_SETUP_COMPLETE.md)
- [Firebase Integration Summary](Docs/FIREBASE_INTEGRATION_SUMMARY.md)
- [Startup Guide](STARTUP_GUIDE.md)
- [Deployment Guide](Docs/DEPLOYMENT.md)

## Troubleshooting

### Firebase Users Not Showing Up

If Firebase authentication users are not appearing:

1. Verify Firebase configuration in environment variables
2. Ensure Email/Password provider is enabled in Firebase Console
3. Check that the service account key is properly configured
4. Verify that users are being created in Firebase Authentication section of Firebase Console
5. Check browser console and backend logs for errors

For detailed troubleshooting, see [FIREBASE_SETUP_COMPLETE.md](Docs/FIREBASE_SETUP_COMPLETE.md)