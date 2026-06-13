// Google Apps Script: Append GoHighLevel Mastery booking and payment events to Google Sheets.
// Deploy as a Web App:
// - Execute as: Me
// - Who has access: Anyone
//
// Sheet columns expected:
// Name | Email | Phone Number | Primary Bottle Neck | Bottleneck Details | Date Scheduled | Source | Status

const SHEET_ID = '1vfGGbV2wOdOCqrp0W_02poc6df7aNq1eXRpo_k63s5s';
const SHEET_NAME = 'Schedule Booked';
const PAYMENT_SHEET_NAME = 'Certification Payments';
const CERTIFICATION_SHEET_NAME = 'Certification Submissions';
const ADMIN_EMAIL = 'maria@jmbrandify.com';

function doPost(e) {
  try {
    const payload = parsePayload_(e);
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);

    if (payload.type === 'payment') {
      return recordPayment_(spreadsheet, payload);
    }

    if (payload.type === 'certification_submission') {
      return recordCertificationSubmission_(spreadsheet, payload);
    }

    const sheet = spreadsheet.getSheetByName(SHEET_NAME);

    if (!sheet) {
      return json_({ success: false, error: `Sheet not found: ${SHEET_NAME}` });
    }

    ensureBookingHeaders_(sheet);

    const row = buildHeaderMappedRow_(sheet, {
      'Name': payload.name || '',
      'Email': payload.email || '',
      'Phone Number': payload.phone || '',
      'Primary Bottle Neck': payload.bottleneck || payload.primaryBottleneck || '',
      'Bottleneck Details': payload.bottleneckDetails || payload.bottleneckIssueDetails || '',
      'Date Scheduled': payload.dateScheduled || nowEastern_(),
      'Source': payload.source || 'Website',
      'Status': payload.status || 'New'
    });

    const existingRows = findExistingBookingRows_(sheet, payload.email, payload.phone);
    const targetRow = existingRows.length ? existingRows[0] : findNextBookingRow_(sheet);
    sheet.getRange(targetRow, 1, 1, row.length).setValues([row]);
    clearDuplicateBookingRows_(sheet, existingRows.slice(1), row.length);
    sendBookingNotification_(payload, targetRow, Boolean(existingRows.length));

    return json_({
      success: true,
      message: existingRows.length ? 'Booking request updated successfully' : 'Booking request added successfully',
      duplicatePrevented: Boolean(existingRows.length),
      duplicatesCleared: Math.max(existingRows.length - 1, 0),
      timestamp: nowEastern_()
    });
  } catch (error) {
    Logger.log(`Booking webhook error: ${error}`);
    return json_({ success: false, error: String(error) });
  }
}

function recordPayment_(spreadsheet, payload) {
  const sheet = getOrCreateSheet_(spreadsheet, PAYMENT_SHEET_NAME);
  ensureHeaders_(sheet, [
    'Timestamp',
    'Email',
    'Certification',
    'Payment Status',
    'PayPal Order ID',
    'PayPal Payer ID',
    'Source'
  ]);

  sheet.appendRow([
    nowEastern_(),
    payload.email || '',
    payload.certification || payload.certType || '',
    payload.paymentStatus || 'Successful',
    payload.paypalOrderId || '',
    payload.paypalPayerId || '',
    payload.source || 'PayPal Hosted Button'
  ]);
  sendPaymentNotification_(payload);

  return json_({
    success: true,
    message: 'Payment event recorded successfully',
    timestamp: nowEastern_()
  });
}

function recordCertificationSubmission_(spreadsheet, payload) {
  const sheet = getOrCreateSheet_(spreadsheet, CERTIFICATION_SHEET_NAME);
  ensureHeaders_(sheet, [
    'Timestamp',
    'Name',
    'Email',
    'Certification',
    'Drive Link',
    'Funnel URL',
    'Workflow Folder',
    'Snapshot Documentation',
    'Loom Link',
    'Problem Solved',
    'Challenge',
    'Proud Of',
    'Source',
    'Status'
  ]);

  sheet.appendRow([
    nowEastern_(),
    payload.name || '',
    payload.email || '',
    payload.certType || payload.certification || '',
    payload.driveLink || '',
    payload.funnelUrl || '',
    payload.workflowFolder || '',
    payload.snapshotDoc || '',
    payload.loomLink || '',
    payload.problem || '',
    payload.challenge || '',
    payload.proud || '',
    payload.source || 'Certification Submission',
    payload.status || 'Pending Review'
  ]);
  sendCertificationSubmissionNotification_(payload);

  return json_({
    success: true,
    message: 'Certification submission recorded successfully',
    timestamp: nowEastern_()
  });
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

function ensureBookingHeaders_(sheet) {
  const requiredHeaders = [
    'Name',
    'Email',
    'Phone Number',
    'Primary Bottle Neck',
    'Bottleneck Details',
    'Date Scheduled',
    'Source',
    'Status'
  ];
  const existingHeaders = getHeaders_(sheet);

  if (!existingHeaders.length) {
    sheet.getRange(1, 1, 1, requiredHeaders.length).setValues([requiredHeaders]);
    return;
  }

  if (!existingHeaders.includes('Bottleneck Details')) {
    const bottleneckIndex = existingHeaders.indexOf('Primary Bottle Neck');
    const insertAfter = bottleneckIndex >= 0 ? bottleneckIndex + 1 : 4;
    sheet.insertColumnAfter(insertAfter);
    sheet.getRange(1, insertAfter + 1).setValue('Bottleneck Details');
  }
}

function ensureHeaders_(sheet, requiredHeaders) {
  const existingHeaders = getHeaders_(sheet);
  if (!existingHeaders.length) {
    sheet.getRange(1, 1, 1, requiredHeaders.length).setValues([requiredHeaders]);
  }
}

function getOrCreateSheet_(spreadsheet, sheetName) {
  return spreadsheet.getSheetByName(sheetName) || spreadsheet.insertSheet(sheetName);
}

function buildHeaderMappedRow_(sheet, valuesByHeader) {
  const headers = getHeaders_(sheet);
  return headers.map(header => valuesByHeader[header] || '');
}

function findNextBookingRow_(sheet) {
  const firstDataRow = 2;
  const maxRows = sheet.getMaxRows();
  const rowCount = Math.max(maxRows - firstDataRow + 1, 1);
  const leadIdentityColumns = 3; // Name, Email, Phone Number

  const values = sheet
    .getRange(firstDataRow, 1, rowCount, leadIdentityColumns)
    .getDisplayValues();

  for (let index = 0; index < values.length; index++) {
    const [name, email, phone] = values[index].map(value => String(value).trim());
    if (!name && !email && !phone) {
      return firstDataRow + index;
    }
  }

  sheet.insertRowAfter(maxRows);
  return maxRows + 1;
}

function findExistingBookingRows_(sheet, email, phone) {
  const firstDataRow = 2;
  const maxRows = sheet.getMaxRows();
  const rowCount = Math.max(maxRows - firstDataRow + 1, 1);
  const normalizedEmail = normalizeEmail_(email);
  const normalizedPhone = normalizePhone_(phone);
  const matches = [];

  if (!normalizedEmail && !normalizedPhone) return matches;

  const values = sheet
    .getRange(firstDataRow, 1, rowCount, 3)
    .getDisplayValues();

  for (let index = 0; index < values.length; index++) {
    const rowEmail = normalizeEmail_(values[index][1]);
    const rowPhone = normalizePhone_(values[index][2]);
    if (normalizedEmail && rowEmail && normalizedEmail === rowEmail) {
      matches.push(firstDataRow + index);
      continue;
    }
    if (normalizedPhone && rowPhone && normalizedPhone === rowPhone) {
      matches.push(firstDataRow + index);
    }
  }

  return matches;
}

function clearDuplicateBookingRows_(sheet, duplicateRows, columnCount) {
  duplicateRows.forEach(rowNumber => {
    sheet.getRange(rowNumber, 1, 1, columnCount).clearContent();
  });
}

function sendBookingNotification_(payload, rowNumber, wasUpdated) {
  safeSendEmail_({
    subject: wasUpdated ? 'Updated booking lead in Schedule Booked' : 'New booking lead in Schedule Booked',
    htmlBody: [
      '<p>A booking lead was recorded in <strong>Schedule Booked</strong>.</p>',
      `<p><strong>Row:</strong> ${rowNumber}</p>`,
      `<p><strong>Name:</strong> ${escapeHtml_(payload.name)}</p>`,
      `<p><strong>Email:</strong> ${escapeHtml_(payload.email)}</p>`,
      `<p><strong>Phone:</strong> ${escapeHtml_(payload.phone)}</p>`,
      `<p><strong>Primary Bottleneck:</strong> ${escapeHtml_(payload.bottleneck || payload.primaryBottleneck)}</p>`,
      `<p><strong>Bottleneck Details:</strong> ${escapeHtml_(payload.bottleneckDetails || payload.bottleneckIssueDetails)}</p>`,
      `<p><strong>Source:</strong> ${escapeHtml_(payload.source || 'Website')}</p>`,
      `<p><strong>Status:</strong> ${wasUpdated ? 'Existing lead updated / duplicate prevented' : 'New lead'}</p>`
    ].join('')
  });
}

function sendPaymentNotification_(payload) {
  safeSendEmail_({
    subject: 'Certification payment recorded',
    htmlBody: [
      '<p>A certification payment was recorded in <strong>Certification Payments</strong>.</p>',
      `<p><strong>Email:</strong> ${escapeHtml_(payload.email)}</p>`,
      `<p><strong>Certification:</strong> ${escapeHtml_(payload.certification || payload.certType)}</p>`,
      `<p><strong>Payment Status:</strong> ${escapeHtml_(payload.paymentStatus || 'Successful')}</p>`,
      `<p><strong>PayPal Order ID:</strong> ${escapeHtml_(payload.paypalOrderId)}</p>`,
      `<p><strong>PayPal Payer ID:</strong> ${escapeHtml_(payload.paypalPayerId)}</p>`
    ].join('')
  });
}

function sendCertificationSubmissionNotification_(payload) {
  safeSendEmail_({
    subject: 'Certification submission ready for review',
    htmlBody: [
      '<p>A certification submission was recorded in <strong>Certification Submissions</strong>.</p>',
      `<p><strong>Name:</strong> ${escapeHtml_(payload.name)}</p>`,
      `<p><strong>Email:</strong> ${escapeHtml_(payload.email)}</p>`,
      `<p><strong>Certification:</strong> ${escapeHtml_(payload.certType || payload.certification)}</p>`,
      `<p><strong>Drive Link:</strong> ${linkHtml_(payload.driveLink)}</p>`,
      `<p><strong>Funnel URL:</strong> ${linkHtml_(payload.funnelUrl)}</p>`,
      `<p><strong>Workflow Folder:</strong> ${linkHtml_(payload.workflowFolder)}</p>`,
      `<p><strong>Loom Link:</strong> ${linkHtml_(payload.loomLink)}</p>`,
      `<p><strong>Status:</strong> Pending Review</p>`
    ].join('')
  });
}

function safeSendEmail_(message) {
  try {
    MailApp.sendEmail({
      to: ADMIN_EMAIL,
      subject: message.subject,
      htmlBody: message.htmlBody
    });
  } catch (error) {
    Logger.log(`Email notification failed: ${error}`);
  }
}

function linkHtml_(url) {
  const safeUrl = escapeHtml_(url);
  if (!safeUrl) return '';
  return `<a href="${safeUrl}">${safeUrl}</a>`;
}

function escapeHtml_(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function normalizeEmail_(email) {
  return String(email || '').trim().toLowerCase();
}

function normalizePhone_(phone) {
  return String(phone || '').replace(/\D/g, '');
}

function getHeaders_(sheet) {
  const lastColumn = sheet.getLastColumn();
  if (!lastColumn) return [];
  return sheet.getRange(1, 1, 1, lastColumn).getValues()[0].map(value => String(value).trim());
}

function json_(value) {
  return ContentService
    .createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}
