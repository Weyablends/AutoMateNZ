// Firebase configuration file
// Get these values from your Firebase Console (https://console.firebase.google.com)
// 1. Create a new Firebase project
// 2. Go to Project Settings > Service Accounts
// 3. Copy your credentials below

export const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Instructions:
// 1. Go to https://console.firebase.google.com
// 2. Click "Create Project" and name it "AutoMate NZ"
// 3. Enable Firestore Database
// 4. Enable Cloud Storage
// 5. Set up authentication (optional)
// 6. In Project Settings > General, copy your config
// 7. Replace the placeholder values above
// 8. Firestore: Create a collection called "contact_submissions"
// 9. Cloud Storage: Set up CORS rules (see setup instructions below)
// 10. Cloud Functions: Deploy email notification function

/*
FIRESTORE DATABASE RULES (Security > Rules):
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /contact_submissions/{document=**} {
      allow create: if true;
      allow read, write: if request.auth != null;
    }
  }
}

STORAGE RULES (Storage > Rules):
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /uploads/{allPaths=**} {
      allow read, write: if true;
    }
  }
}
*/