// Google Apps Script: Append GoHighLevel Mastery booking requests to Google Sheets.
// Deploy as a Web App:
// - Execute as: Me
// - Who has access: Anyone
//
// Sheet columns expected:
// Name | Email | Phone Number | Primary Bottle Neck | Date Scheduled | Source | Status

const SHEET_ID = '1vfGGbV2wOdOCqrp0W_02poc6df7aNq1eXRpo_k63s5s';
const SHEET_NAME = 'Schedule Booked';

function doPost(e) {
  try {
    const payload = parsePayload_(e);
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);

    if (!sheet) {
      return json_({ success: false, error: `Sheet not found: ${SHEET_NAME}` });
    }

    sheet.appendRow([
      payload.name || '',
      payload.email || '',
      payload.phone || '',
      payload.bottleneck || payload.primaryBottleneck || '',
      payload.dateScheduled || nowEastern_(),
      payload.source || 'Website',
      payload.status || 'New'
    ]);

    return json_({
      success: true,
      message: 'Booking request added successfully',
      timestamp: nowEastern_()
    });
  } catch (error) {
    Logger.log(`Booking webhook error: ${error}`);
    return json_({ success: false, error: String(error) });
  }
}

function doGet() {
  return json_({
    success: true,
    message: 'GoHighLevel Mastery booking webhook is running.'
  });
}

function parsePayload_(e) {
  if (!e) return {};

  if (e.postData && e.postData.contents) {
    try {
      return JSON.parse(e.postData.contents);
    } catch (error) {
      Logger.log(`JSON parse failed, falling back to parameters: ${error}`);
    }
  }

  return e.parameter || {};
}

function nowEastern_() {
  return Utilities.formatDate(new Date(), 'America/New_York', 'M/d/yyyy h:mm:ss a');
}

function json_(value) {
  return ContentService
    .createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}
