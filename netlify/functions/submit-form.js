const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Google Sheets API setup
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive.file'];
const SPREADSHEET_ID = process.env.SPREADSHEET_ID || 'YOUR_SPREADSHEET_ID_HERE';

// Service account credentials (set as environment variables in Netlify)
const credentials = {
  type: "service_account",
  project_id: process.env.GOOGLE_PROJECT_ID,
  private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
  private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  client_id: process.env.GOOGLE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.GOOGLE_CLIENT_X509_CERT_URL
};

async function getAuthClient() {
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: SCOPES,
  });
  return auth;
}

async function appendToSheet(sheetName, data) {
  try {
    const auth = await getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });

    // Get current data to determine next row
    const getResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A:A`,
    });

    const nextRow = (getResponse.data.values?.length || 0) + 1;

    // Prepare data for appending
    const values = [data];
    const resource = { values };

    // Append to sheet
    const appendResponse = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A${nextRow}`,
      valueInputOption: 'RAW',
      resource,
    });

    return { success: true, row: nextRow };
  } catch (error) {
    console.error('Error appending to sheet:', error);
    throw error;
  }
}

async function uploadImageToDrive(file, fileName, folderId) {
  try {
    const auth = await getAuthClient();
    const drive = google.drive({ version: 'v3', auth });

    const fileMetadata = {
      name: fileName,
      parents: [folderId],
    };

    const media = {
      mimeType: file.mimetype || 'image/jpeg',
      body: file,
    };

    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id,webViewLink',
    });

    // Make file publicly accessible
    await drive.permissions.create({
      fileId: response.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    return {
      fileId: response.data.id,
      url: response.data.webViewLink,
      directUrl: `https://drive.google.com/uc?export=view&id=${response.data.id}`
    };
  } catch (error) {
    console.error('Error uploading to Drive:', error);
    throw error;
  }
}

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const data = JSON.parse(event.body);
    const { formType, fullName, email, phone, make, model, year, kilometres, rego, askingPrice, location, extraDetails, images } = data;

    let result;

    if (formType === 'contact') {
      // Contact form - goes to "Contacts" sheet
      const contactData = [
        new Date().toISOString(),
        email,
        phone || '',
        message || '',
        'New'
      ];

      result = await appendToSheet('Contacts', contactData);
    } else if (formType === 'submission') {
      // Car submission form - goes to "Submissions" sheet with all details
      const submissionData = [
        new Date().toISOString(),
        fullName || '',
        email || '',
        phone || '',
        make || '',
        model || '',
        year || '',
        kilometres || '',
        rego || '',
        askingPrice || '',
        location || '',
        extraDetails || '',
        images?.length || 0,
        'New'
      ];

      result = await appendToSheet('Submissions', submissionData);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Form submitted successfully',
        ...result
      }),
    };

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message
      }),
    };
  }
};