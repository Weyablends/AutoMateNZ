/**
 * Firebase Backend Integration
 * 
 * This module handles all backend operations:
 * - Saving form submissions to Firestore
 * - Uploading images to Cloud Storage
 * - Real-time updates
 */

import { firebaseConfig } from "../firebase.js";

// Initialize Firebase (do this once in your app)
export const initFirebase = async () => {
  try {
    // Dynamic import of Firebase modules
    const { initializeApp } = await import("firebase/app");
    const { getFirestore } = await import("firebase/firestore");
    const { getStorage } = await import("firebase/storage");

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const storage = getStorage(app);

    return { app, db, storage };
  } catch (error) {
    console.error("Failed to initialize Firebase:", error);
    throw error;
  }
};

/**
 * Submit contact form with images
 * @param {Object} contactData - Form data { email, phone, message }
 * @param {Array} imageFiles - Array of File objects
 * @returns {Promise<string>} - Document ID
 */
export const submitContactForm = async (contactData, imageFiles = []) => {
  try {
    const { db, storage } = await initFirebase();
    const { collection, addDoc, serverTimestamp } = await import("firebase/firestore");
    const { ref, uploadBytes } = await import("firebase/storage");

    // Create submission object
    const submission = {
      email: contactData.email,
      phone: contactData.phone || "",
      message: contactData.message,
      timestamp: serverTimestamp(),
      imageCount: imageFiles.length,
      imageUrls: [],
      status: "pending", // pending, contacted, completed
      notes: ""
    };

    // Upload images to Cloud Storage and get URLs
    if (imageFiles.length > 0) {
      const imageUrls = [];
      
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i].file;
        const fileName = `${Date.now()}-${file.name}`;
        const fileRef = ref(storage, `uploads/${contactData.email}/${fileName}`);
        
        await uploadBytes(fileRef, file);
        imageUrls.push(fileRef.fullPath);
      }
      
      submission.imageUrls = imageUrls;
    }

    // Save to Firestore
    const docRef = await addDoc(
      collection(db, "contact_submissions"),
      submission
    );

    return docRef.id;
  } catch (error) {
    console.error("Error submitting form:", error);
    throw error;
  }
};

/**
 * Get all contact submissions (admin only)
 */
export const getContactSubmissions = async () => {
  try {
    const { db } = await initFirebase();
    const { collection, query, orderBy, getDocs } = await import("firebase/firestore");

    const q = query(
      collection(db, "contact_submissions"),
      orderBy("timestamp", "desc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return [];
  }
};

/**
 * Update submission status (admin only)
 */
export const updateSubmissionStatus = async (docId, status, notes = "") => {
  try {
    const { db } = await initFirebase();
    const { doc, updateDoc } = await import("firebase/firestore");

    await updateDoc(doc(db, "contact_submissions", docId), {
      status,
      notes,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error("Error updating submission:", error);
    throw error;
  }
};
