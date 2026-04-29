/**
 * Firebase Cloud Function to send emails when new contact forms are submitted
 * 
 * Deploy this function using:
 * firebase deploy --only functions
 * 
 * Or deploy via Firebase Console:
 * - Go to Functions in Firebase Console
 * - Create a new function
 * - Copy this code
 * - Set trigger to "Firestore document created"
 * - Collection path: "contact_submissions"
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

// Configure your email service
// For Gmail, use an App Password: https://support.google.com/accounts/answer/185833
// For SendGrid/Mailgun, use their SMTP credentials

const transporter = nodemailer.createTransport({
  service: "gmail", // or your email service
  auth: {
    user: "sebmeijer47@gmail.com",
    pass: "YOUR_APP_PASSWORD_HERE" // Use app-specific password, not your actual password
  }
});

exports.sendContactEmail = functions.firestore
  .document("contact_submissions/{docId}")
  .onCreate(async (snap, context) => {
    const data = snap.data();

    // Email to admin
    const adminMailOptions = {
      from: "AutoMate NZ <noreply@automate.co.nz>",
      to: "sebmeijer47@gmail.com",
      subject: `New Contact Form Submission from ${data.email}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone || "Not provided"}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message.replace(/\n/g, "<br>")}</p>
        <p><strong>Submitted:</strong> ${new Date(data.timestamp).toLocaleString()}</p>
        <p><strong>Images:</strong> ${data.imageCount || 0} image(s) uploaded</p>
        <hr>
        <p>View submission in Firebase Console</p>
      `
    };

    // Confirmation email to customer
    const customerMailOptions = {
      from: "AutoMate NZ <noreply@automate.co.nz>",
      to: data.email,
      subject: "We Received Your Message - AutoMate NZ",
      html: `
        <h2>Thank You for Contacting AutoMate NZ</h2>
        <p>Hi,</p>
        <p>We've received your message and will get back to you within 24 hours.</p>
        <p><strong>Your Details:</strong></p>
        <p>Email: ${data.email}</p>
        <p>Phone: ${data.phone || "Not provided"}</p>
        <p><strong>Your Message:</strong></p>
        <p>${data.message.replace(/\n/g, "<br>")}</p>
        <hr>
        <p>Best regards,</p>
        <p>AutoMate NZ Team</p>
        <p><em>Support: sebmeijer47@gmail.com</em></p>
      `
    };

    try {
      // Send both emails
      await transporter.sendMail(adminMailOptions);
      await transporter.sendMail(customerMailOptions);

      console.log("Emails sent successfully");
      return { success: true };
    } catch (error) {
      console.error("Error sending emails:", error);
      throw new functions.https.HttpsError(
        "internal",
        "Failed to send email"
      );
    }
  });

/**
 * DEPLOYMENT INSTRUCTIONS:
 * 
 * 1. Go to Firebase Console > Functions
 * 2. Create a new function
 * 3. Runtime: Node.js 18 or higher
 * 4. Code: Replace with the above code
 * 5. Set trigger:
 *    - Event type: "onWrite"
 *    - Cloud Firestore path: "contact_submissions/{docId}"
 * 6. Deploy
 * 
 * IMPORTANT: Update email credentials!
 * For Gmail users:
 * - Enable 2-factor authentication
 * - Create an App Password: https://myaccount.google.com/apppasswords
 * - Use the 16-character password above
 */