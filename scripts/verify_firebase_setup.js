/**
 * Firebase Setup Verification Script
 * Run this script from the backend directory to verify Firebase configuration
 * Usage: node ../scripts/verify_firebase_setup.js
 */

// Load environment variables
require('dotenv').config();

const admin = require('firebase-admin');

console.log('=== Firebase Setup Verification ===\n');

// Check environment variables
console.log('1. Environment Variables Check:');
console.log('   FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID ? '✓ SET' : '✗ MISSING');
console.log('   FIREBASE_CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL ? '✓ SET' : '✗ MISSING');
console.log('   FIREBASE_PRIVATE_KEY:', process.env.FIREBASE_PRIVATE_KEY ? '✓ SET' : '✗ MISSING');
console.log('   FIREBASE_PRIVATE_KEY_ID:', process.env.FIREBASE_PRIVATE_KEY_ID ? '✓ SET' : '✗ MISSING');
console.log('   FIREBASE_CLIENT_ID:', process.env.FIREBASE_CLIENT_ID ? '✓ SET' : '✗ MISSING');
console.log('   FIREBASE_CLIENT_CERT_URL:', process.env.FIREBASE_CLIENT_CERT_URL ? '✓ SET' : '✗ MISSING');

console.log('\n2. Private Key Validation:');
if (process.env.FIREBASE_PRIVATE_KEY) {
  const keyLength = process.env.FIREBASE_PRIVATE_KEY.length;
  const hasPlaceholder = process.env.FIREBASE_PRIVATE_KEY.includes('YOUR_PRIVATE_KEY_HERE');
  console.log('   Key Length:', keyLength);
  console.log('   Has Placeholder:', hasPlaceholder ? '✗ YES (INVALID)' : '✓ NO (VALID)');
  console.log('   Appears Valid:', (keyLength > 50 && !hasPlaceholder) ? '✓ YES' : '✗ NO');
}

// Try to initialize Firebase Admin
console.log('\n3. Firebase Admin Initialization:');
try {
  if (process.env.FIREBASE_PROJECT_ID && 
      process.env.FIREBASE_CLIENT_EMAIL && 
      process.env.FIREBASE_PRIVATE_KEY && 
      process.env.FIREBASE_PRIVATE_KEY.length > 50 && 
      !process.env.FIREBASE_PRIVATE_KEY.includes('YOUR_PRIVATE_KEY_HERE')) {
    
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
    console.log('\n4. Firebase Admin Functionality Test:');
    admin.auth().listUsers(1)
      .then(users => {
        console.log('   ✓ Firebase Admin API working - can list users');
        console.log('   First user (if any):', users.users[0] ? users.users[0].email : 'No users found');
      })
      .catch(error => {
        console.log('   ! Firebase Admin API test failed:', error.message);
        console.log('   This might be okay if no users exist yet');
      })
      .finally(() => {
        app.delete(); // Clean up
        console.log('\n=== Verification Complete ===');
      });
  } else {
    console.log('   ✗ Cannot initialize - missing or invalid configuration');
    console.log('\n=== Verification Complete ===');
  }
} catch (error) {
  console.log('   ✗ Firebase Admin initialization failed:', error.message);
  console.log('\n=== Verification Complete ===');
}