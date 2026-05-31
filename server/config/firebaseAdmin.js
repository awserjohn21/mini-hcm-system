require("dotenv").config();
var admin = require("firebase-admin");

// Check if all necessary environment variables are set
if (
  !process.env.FIREBASE_PROJECT_ID ||
  !process.env.FIREBASE_CLIENT_EMAIL ||
  !process.env.FIREBASE_PRIVATE_KEY
) {
  console.error("Missing Firebase service account environment variables.");
  process.exit(1);
}

// Construct the service account object from environment variables
const serviceAccountConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountConfig),
});

var db = admin.firestore();
var auth = admin.auth();

module.exports = { admin, db, auth };
