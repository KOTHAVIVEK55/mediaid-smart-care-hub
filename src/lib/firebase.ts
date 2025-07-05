
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase Configuration - Replace with your actual Firebase config
// Get this from Firebase Console -> Project Settings -> General -> Your apps
const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456789012345678"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Export the app instance
export default app;

/* 
🔥 FIREBASE SETUP INSTRUCTIONS:

1. Go to https://console.firebase.google.com/
2. Create a new project or select existing one
3. Enable the following services:
   - Authentication (Email/Password)
   - Firestore Database
   - Storage

4. Get your config:
   - Project Settings -> General -> Your apps -> Web app
   - Copy the firebaseConfig object and replace the one above

5. Set up Authentication:
   - Authentication -> Sign-in method
   - Enable "Email/Password"

6. Set up Firestore:
   - Firestore Database -> Create database
   - Start in test mode (for development)

7. Set up Storage:
   - Storage -> Get started
   - Start in test mode (for development)

8. Firestore Security Rules (for production):
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.token.email == userId;
       }
       match /reports/{document} {
         allow read, write: if request.auth != null && request.auth.token.email == resource.data.userId;
       }
       match /appointments/{document} {
         allow read, write: if request.auth != null;
       }
       match /emergencies/{document} {
         allow read, write: if request.auth != null;
       }
     }
   }

9. Storage Security Rules (for production):
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /reports/{userId}/{allPaths=**} {
         allow read, write: if request.auth != null && request.auth.token.email == userId;
       }
     }
   }
*/
