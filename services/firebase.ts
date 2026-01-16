// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/setup#available-libraries
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "00000000000",
  appId: "1:00000000000:web:00000000000000"
};

// Initialize Firebase
// We wrap this in a try-catch to prevent the app from crashing if the config is invalid/missing during dev
let app;
let auth;
let db;
let googleProvider;

try {
    // Only initialize if we have a real key (rudimentary check)
    if (firebaseConfig.apiKey !== "YOUR_FIREBASE_API_KEY") {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
        googleProvider = new GoogleAuthProvider();
    } else {
        console.warn("Firebase not configured. Using local mock mode.");
    }
} catch (e) {
    console.error("Firebase Initialization Error:", e);
}

export { auth, db, googleProvider };
export const isFirebaseReady = () => !!app;