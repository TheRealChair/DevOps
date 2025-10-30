import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
// You'll need to replace these with your actual Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyCFOZEo8MHBRWYnqLR1S8RUYik7k26UMXM",   // Only help identify the project, firebase security rules protects data
  authDomain: "devops-escaperoom.firebaseapp.com",
  projectId: "devops-escaperoom",
  storageBucket: "devops-escaperoom.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
