// Simple Firebase verification script
require('dotenv').config();
const admin = require('firebase-admin');

console.log('=== Firebase Configuration Verification ===\n');

// Check environment variables
console.log('1. Environment Variables Check:');
console.log('   FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID ? '✓ SET' : '✗ MISSING');
console.log('   FIREBASE_CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL ? '✓ SET' : '✗ MISSING');
console.log('   FIREBASE_PRIVATE_KEY:', process.env.FIREBASE_PRIVATE_KEY ? '✓ SET' : '✗ MISSING');

// Try to initialize Firebase Admin
console.log('\n2. Firebase Admin Initialization:');
try {
  if (process.env.FIREBASE_PROJECT_ID && 
      process.env.FIREBASE_CLIENT_EMAIL && 
      process.env.FIREBASE_PRIVATE_KEY) {
    
    const serviceAccount = {
      type: 'service_account',
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
    };

    const app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    
    console.log('   ✓ Firebase Admin initialized successfully');
    
    // Test basic functionality
    console.log('\n3. Firebase Admin Functionality Test:');
    admin.auth().listUsers(1)
      .then(users => {
        console.log('   ✓ Firebase Admin API working - can list users');
        if (users.users.length > 0) {
          console.log('   Sample user:', users.users[0].email || users.users[0].uid);
        } else {
          console.log('   No users found (this is okay for a new project)');
        }
      })
      .catch(error => {
        console.log('   ! Firebase Admin API test result:', error.message);
        console.log('   This might be okay depending on your Firebase setup');
      })
      .finally(() => {
        app.delete(); // Clean up
        console.log('\n=== Verification Complete ===');
      });
  } else {
    console.log('   ✗ Cannot initialize - missing configuration');
    console.log('\n=== Verification Complete ===');
  }
} catch (error) {
  console.log('   ✗ Firebase Admin initialization failed:', error.message);
  console.log('\n=== Verification Complete ===');
}