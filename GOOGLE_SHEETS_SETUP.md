# Google Sheets Integration Setup Guide

This guide will help you set up Google Sheets integration for your AutoMate NZ website forms.

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Google Sheets API
   - Google Drive API

## Step 2: Create a Service Account

1. In Google Cloud Console, go to "IAM & Admin" > "Service Accounts"
2. Click "Create Service Account"
3. Give it a name like "automate-nz-sheets"
4. Grant it "Editor" role
5. Create a JSON key and download it

## Step 3: Create Google Sheets Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Create two sheets:
   - "Contacts" - for contact form submissions
   - "Submissions" - for car selling submissions

### Contacts Sheet Headers (Row 1):
```
A1: Timestamp
B1: Email
C1: Phone
D1: Message
E1: Status
```

### Submissions Sheet Headers (Row 1):
```
A1: Timestamp
B1: Full Name
C1: Email
D1: Phone
E1: Make
F1: Model
G1: Year
H1: Kilometres
I1: Rego
J1: Asking Price
K1: Location
L1: Extra Details
M1: Image Count
N1: Status
```

4. Share the spreadsheet with your service account email (from the JSON key)
5. Copy the spreadsheet ID from the URL (the long string between `/d/` and `/edit`)

## Step 4: Set up Netlify Environment Variables

1. In your Netlify dashboard, go to your site settings
2. Go to "Environment variables"
3. Add these variables from your service account JSON:

```
GOOGLE_PROJECT_ID=your_project_id
GOOGLE_PRIVATE_KEY_ID=your_private_key_id
GOOGLE_PRIVATE_KEY=your_private_key
GOOGLE_CLIENT_EMAIL=your_client_email
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_X509_CERT_URL=your_cert_url
SPREADSHEET_ID=your_spreadsheet_id
```

**Important:** The private key should be on multiple lines with `\n` for newlines.

## Step 5: Deploy to Netlify

1. Push your code to GitHub/GitLab
2. Connect your repository to Netlify
3. Deploy the site
4. The Netlify function will be available at `/.netlify/functions/submit-form`

## Step 6: Test the Integration

1. Visit your deployed site
2. Fill out the contact form
3. Check your Google Sheets to see if data appears
4. Test the car submission form (when implemented)

## Troubleshooting

### Common Issues:

1. **"The caller does not have permission"**
   - Make sure the service account has edit access to the spreadsheet
   - Check that the spreadsheet ID is correct

2. **"Invalid credentials"**
   - Verify all environment variables are set correctly
   - Make sure the private key is properly formatted with newlines

3. **Function timeout**
   - Netlify functions have a 10-second timeout for free plans
   - Consider upgrading or optimizing the function

### Fallback Behavior

If the Google Sheets integration fails, the forms will automatically fall back to opening a mailto link to send emails to sebmeijer47@gmail.com.

## Security Notes

- Never commit the service account JSON file to your repository
- Use environment variables for all sensitive data
- The service account only has access to the specific spreadsheet you shared with it
- Consider implementing rate limiting and validation on the frontend