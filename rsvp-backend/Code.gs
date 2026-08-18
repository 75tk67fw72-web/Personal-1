const SHEET_NAME = "RSVP";
const HEADERS = ["family", "timestamp", "data_json"];

function getOrCreateSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
  } else if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
  }
  return sheet;
}

function doPost(e) {
  const sheet = getOrCreateSheet_();
  let payload;
  try {
    payload = JSON.parse(e.postData.contents);
  } catch (err) {
    return jsonResponse_({ ok: false, error: "Invalid JSON" });
  }

  const family = payload.family;
  const timestamp = payload.timestamp || new Date().toISOString();
  if (!family) {
    return jsonResponse_({ ok: false, error: "Missing family" });
  }

  const dataJson = JSON.stringify(payload);
  const lastRow = sheet.getLastRow();
  let targetRow = -1;

  if (lastRow > 1) {
    const familyValues = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
    for (let i = 0; i < familyValues.length; i++) {
      if (familyValues[i][0] === family) {
        targetRow = i + 2;
        break;
      }
    }
  }

  if (targetRow === -1) {
    sheet.appendRow([family, timestamp, dataJson]);
  } else {
    sheet.getRange(targetRow, 1, 1, 3).setValues([[family, timestamp, dataJson]]);
  }

  return jsonResponse_({ ok: true });
}

function doGet(e) {
  const sheet = getOrCreateSheet_();
  const lastRow = sheet.getLastRow();
  const records = [];

  if (lastRow > 1) {
    const values = sheet.getRange(2, 1, lastRow - 1, 3).getValues();
    values.forEach(row => {
      const dataJson = row[2];
      if (!dataJson) return;
      try {
        records.push(JSON.parse(dataJson));
      } catch (err) {
        // skip malformed row
      }
    });
  }

  return jsonResponse_(records);
}

function jsonResponse_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
