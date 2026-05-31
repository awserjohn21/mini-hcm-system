import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC4ByKitjvxxxC0FO_mYf-hS6Ywbs_OqTM",
  authDomain: "hcmfirebase.firebaseapp.com",
  projectId: "hcmfirebase",
  storageBucket: "hcmfirebase.firebasestorage.app",
  messagingSenderId: "586585167998",
  appId: "1:586585167998:web:e69c18d19496cf230fe02f",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
