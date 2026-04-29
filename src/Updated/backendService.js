/**
 * Backend Service - Form Submission Handler
 * Uses Netlify Functions for Google Sheets integration
 */

const NETLIFY_FUNCTION_URL = '/.netlify/functions/submit-form';

export const submitContactForm = async (contactData, imageFiles = []) => {
  try {
    const payload = {
      formType: 'contact',
      email: contactData.email,
      phone: contactData.phone || '',
      message: contactData.message,
      images: imageFiles.length // For now, just count - full image upload would need multipart form data
    };

    const response = await fetch(NETLIFY_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Submission failed');
    }

    console.log('Contact form submitted successfully:', result);
    return result.row; // Return the row number from Google Sheets

  } catch (error) {
    console.error('Contact form submission error:', error);
    // Fallback to email if Netlify function fails
    try {
      await sendViaEmail(contactData, imageFiles);
      return 'email_fallback';
    } catch (emailError) {
      console.error('Email fallback also failed:', emailError);
      throw error;
    }
  }
};

export const submitCarSubmission = async (submissionData, imageFiles = []) => {
  try {
    const payload = {
      formType: 'submission',
      email: submissionData.email,
      phone: submissionData.phone || '',
      message: submissionData.message,
      images: imageFiles // Array of image data or URLs
    };

    const response = await fetch(NETLIFY_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Submission failed');
    }

    console.log('Car submission form submitted successfully:', result);
    return result.row; // Return the row number from Google Sheets

  } catch (error) {
    console.error('Car submission error:', error);
    // Fallback to email if Netlify function fails
    try {
      await sendViaEmail(submissionData, imageFiles);
      return 'email_fallback';
    } catch (emailError) {
      console.error('Email fallback also failed:', emailError);
      throw error;
    }
  }
};

export const sendViaEmail = async (contactData, imageFiles) => {
  const subject = encodeURIComponent('AutoMate NZ Form Submission');
  const body = encodeURIComponent(`
New form submission from AutoMate NZ website:

Email: ${contactData.email}
Phone: ${contactData.phone}

Message:
${contactData.message}

Number of images: ${imageFiles.length}

---
Sent from AutoMate NZ contact form
  `);

  const mailtoLink = `mailto:sebmeijer47@gmail.com?subject=${subject}&body=${body}`;
  window.location.href = mailtoLink;
};

// Legacy functions for backward compatibility
let submissionsDatabase = [];
export const getSubmissions = () => submissionsDatabase;
export const clearSubmissions = () => { submissionsDatabase = []; };
