# AutoMate NZ - Backend Setup Guide

## 🚀 Full Backend with Firebase Setup

Your contact form is now ready to connect with a full backend! Follow these steps to enable automatic form submission, image uploads, and email notifications.

---

## **Step 1: Create a Firebase Project** ✅

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Create Project"**
3. Name it: **"AutoMate NZ"**
4. Accept the terms and create the project
5. Wait for setup to complete (takes 1-2 minutes)

---

## **Step 2: Set Up Firestore Database** 📁

1. In the left sidebar, go to **Database** or **Firestore**
2. Click **"Create Database"**
3. Choose **"Start in production mode"**
4. Select region: **closest to New Zealand**
5. Click **"Create"**

### Create a Collection:
1. Click **"Start Collection"**
2. Collection ID: `contact_submissions`
3. Auto-generate document ID
4. Skip adding the first document, click **"Save"**

---

## **Step 3: Set Up Cloud Storage** 🖼️

1. In the left sidebar, click **Storage**
2. Click **"Get Started"**
3. Start in test mode (we'll secure it later)
4. Select the same region as Firestore
5. Click **"Done"**

---

## **Step 4: Get Your Firebase Credentials** 🔑

1. Go to **Project Settings** (gear icon top right)
2. Click the **"General"** tab
3. Scroll down and you'll see **"Your apps"** section
4. Click **"</>" (Add app)** to add a web app
5. Name it: **"AutoMate NZ Web"**
6. Check **"Set up Firebase Hosting"** (optional)
7. Click **"Register app"**
8. Copy the Firebase config object that looks like:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "automate-nz-xxxxx",
  storageBucket: "automate-nz-xxxxx.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};
```

---

## **Step 5: Update Your Config File** 🔧

1. Open `src/firebase.js` in your editor
2. Replace the placeholder values with your actual Firebase config
3. Save the file

Example:
```javascript
export const firebaseConfig = {
  apiKey: "AIzaSy1234567890...",
  authDomain: "automate-nz-12345.firebaseapp.com",
  projectId: "automate-nz-12345",
  storageBucket: "automate-nz-12345.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

---

## **Step 6: Set Up Security Rules** 🔒

### Firestore Security Rules:
1. Go to **Firestore Database > Rules**
2. Replace the code with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /contact_submissions/{document=**} {
      allow create: if true;
      allow read, write: if request.auth != null;
    }
  }
}
```

3. Click **"Publish"**

### Storage Security Rules:
1. Go to **Storage > Rules**
2. Replace with:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /uploads/{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

3. Click **"Publish"**

---

## **Step 7: Set Up Automated Emails** 📧

### Install Firebase Extension:
1. Go to **Extensions** in left sidebar
2. Click **"Explore Extensions"**
3. Search for **"Send Email"** (by Google Cloud)
4. Click **"Install in Console"**
5. Choose your project
6. Configure the extension:
   - **Cloud Firestore collection path:** `contact_submissions`
   - **SMTP connection URI:** Get from your email provider
   - **Default "from" address:** `noreply@automate.co.nz` (or your email)
   - **Email document field:** `email`

**Note:** You can use Mailgun (free) or SendGrid for SMTP email sending.

---

## **Step 8: Install Dependencies (Backend)** 📦

If not already installed, run:
```bash
npm install firebase
```

---

## **Step 9: Test the Contact Form** ✨

1. Run your dev server: `npm run dev`
2. Navigate to `/contact` page
3. Fill in the form with test data
4. Upload a test image
5. Click **"Send Message"**
6. Check your Firestore console to see the submission

---

## **What Now Works:**

✅ **Form submissions** automatically saved to Firestore  
✅ **Image uploads** stored in Cloud Storage  
✅ **Automatic emails** sent to your inbox  
✅ **No manual email send** required  
✅ **Data persistence** - all submissions stored permanently  
✅ **Admin dashboard** - view all submissions in Firebase Console  

---

## **Optional: Add Admin Dashboard**

Create a page at `/admin` where you can:
- View all contact submissions
- Download images
- Respond to inquiries

(This requires additional React code - let me know if you'd like this!)

---

## **Troubleshooting:**

**Q: Form says "Failed to submit"?**
- Check your Firebase config in `src/firebase.js`
- Verify Firestore security rules allow writes

**Q: Images not uploading?**
- Check Storage security rules
- Verify image size < 5MB
- Check browser console for errors

**Q: Emails not sending?**
- Ensure email extension is installed
- Check email configuration in Extensions
- Verify SMTP credentials

---

## **Production Deployment:**

Once everything works locally:
1. Run `npm run build`
2. Deploy `dist` folder to Netlify/Vercel
3. Update Firebase config if using custom domain
4. Set up custom email domain in Firebase

---

**Next Steps:**
1. Follow the steps above to set up Firebase
2. Update `src/firebase.js` with your credentials
3. Test the contact form
4. Deploy to production!

Questions? Check the [Firebase Documentation](https://firebase.google.com/docs)
