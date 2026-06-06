// Google Apps Script: Append form submissions to Google Sheet
// Deploy as a Web App with "Execute as" set to your account and "Who has access" set to "Anyone"
// 
// Instructions:
// 1. Go to https://script.google.com
// 2. Create a new project
// 3. Copy this entire code into the script editor
// 4. Replace SHEET_ID with your actual Google Sheet ID (from the URL)
// 5. Make sure your sheet has columns: Timestamp, Name, Email, Phone Number, Primary Bottleneck, Source, Status
// 6. Deploy > New Deployment > Web app > Execute as [your account] > Who has access: Anyone
// 7. Copy the deployment URL and paste it into ghl-roadmap.html as APPS_SCRIPT_WEBHOOK_URL

const SHEET_ID = '1vfGGbV2wOdOCqrp0W_02poc6df7aNq1eXRpo_k63s5s';
const SHEET_NAME = 'Schedule Booked'; // Change if your sheet has a different name

/**
 * doPost: Handle incoming webhook POST requests
 */
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      return ContentService
        .createTextOutput(JSON.stringify({ success: false, error: 'Sheet not found' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Append new row with timestamp
    const timestamp = new Date().toLocaleString('en-US', {
      timeZone: 'America/New_York',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const newRow = [
      timestamp,
      payload.name || '',
      payload.email || '',
      payload.phone || '',
      payload.bottleneck || '',
      payload.source || '',
      payload.status || ''
    ];

    sheet.appendRow(newRow);

    // Log the submission
    Logger.log(`New lead added: ${payload.name} (${payload.email})`);

    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: true, 
        message: 'Lead added successfully',
        timestamp: timestamp
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log('Error: ' + error);
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        error: error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * doGet: Handle GET requests (optional, for testing)
 */
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ 
      success: true, 
      message: 'Google Apps Script webhook is running. POST JSON data to this URL.' 
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
