const admin = require('firebase-admin');
require('dotenv').config();

// Initialize Firebase Admin SDK
let firebaseAdmin = null;

try {
  // Check if we have valid Firebase credentials
  const hasValidCredentials = process.env.FIREBASE_PROJECT_ID && 
                             process.env.FIREBASE_CLIENT_EMAIL && 
                             process.env.FIREBASE_PRIVATE_KEY && 
                             process.env.FIREBASE_PRIVATE_KEY.length > 50 && 
                             !process.env.FIREBASE_PRIVATE_KEY.includes('YOUR_PRIVATE_KEY_HERE');
  
  if (hasValidCredentials) {
    // Log config for debugging (without exposing private key)
    console.log('Firebase config check:', {
      projectId: !!process.env.FIREBASE_PROJECT_ID,
      clientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
      privateKeyLength: process.env.FIREBASE_PRIVATE_KEY.length,
      privateKeyId: !!process.env.FIREBASE_PRIVATE_KEY_ID,
      clientId: !!process.env.FIREBASE_CLIENT_ID
    });
    
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

    firebaseAdmin = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('Firebase Admin initialized successfully');
  } else {
    console.warn('Firebase Admin not initialized - missing or invalid environment variables');
    console.log('Environment variables check:', {
      FIREBASE_PROJECT_ID: !!process.env.FIREBASE_PROJECT_ID,
      FIREBASE_CLIENT_EMAIL: !!process.env.FIREBASE_CLIENT_EMAIL,
      FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY ? 'exists' : 'missing',
      FIREBASE_PRIVATE_KEY_VALID: process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_PRIVATE_KEY.length > 50 && !process.env.FIREBASE_PRIVATE_KEY.includes('YOUR_PRIVATE_KEY_HERE')
    });
  }
} catch (error) {
  console.warn('Firebase Admin initialization failed:', error.message);
  console.error('Full error:', error);
  firebaseAdmin = null;
}

/**
 * Create a new user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} - User record
 */
const createUserWithEmailAndPassword = async (email, password) => {
  if (!firebaseAdmin) {
    throw new Error('Firebase Admin not initialized');
  }
  
  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });
    return userRecord;
  } catch (error) {
    throw new Error(`Error creating user: ${error.message}`);
  }
};

/**
 * Verify Firebase ID token
 * @param {string} idToken - Firebase ID token
 * @returns {Promise<Object>} - Decoded token
 */
const verifyIdToken = async (idToken) => {
  if (!firebaseAdmin) {
    throw new Error('Firebase Admin not initialized');
  }
  
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    throw new Error(`Error verifying token: ${error.message}`);
  }
};

module.exports = {
  createUserWithEmailAndPassword,
  verifyIdToken
};