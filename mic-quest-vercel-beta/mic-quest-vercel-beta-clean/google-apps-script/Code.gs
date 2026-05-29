/**
 * Mic Quest Google Sheet Leaderboard
 *
 * Setup:
 * 1. Create a Google Sheet.
 * 2. Open Extensions > Apps Script.
 * 3. Paste this whole file into Code.gs.
 * 4. Deploy > New deployment > Web app.
 * 5. Execute as: Me.
 * 6. Who has access: Anyone.
 * 7. Copy the Web App URL into the Mic Quest home screen.
 */

const SHEET_NAME = 'Scores';
const MAX_RETURNED_SCORES = 20;

function doGet(e) {
  try {
    const action = String((e.parameter.action || 'list')).toLowerCase();
    let result;
    if (action === 'submit') {
      result = submitScore_(e.parameter);
    } else if (action === 'list') {
      result = { ok: true, scores: getTopScores_() };
    } else {
      result = { ok: false, error: 'Unknown action.' };
    }
    return output_(result, e.parameter.callback);
  } catch (err) {
    return output_({ ok: false, error: String(err && err.message ? err.message : err) }, e.parameter.callback);
  }
}

function doPost(e) {
  return doGet(e);
}

function submitScore_(params) {
  const sheet = getSheet_();
  const entry = {
    submittedAt: new Date(),
    name: clean_(params.name || 'Unnamed Team', 40),
    score: clampInt_(params.score, 0, 60),
    total: clampInt_(params.total, 1, 60),
    perfect: clampInt_(params.perfect, 0, 15),
    timeMs: clampInt_(params.time || params.timeMs, 0, 3600000),
    mode: clean_(params.mode || '', 20),
    browserDate: clean_(params.date || '', 40)
  };

  sheet.appendRow([
    entry.submittedAt,
    entry.name,
    entry.score,
    entry.total,
    entry.perfect,
    entry.timeMs,
    entry.mode,
    entry.browserDate
  ]);

  return { ok: true, scores: getTopScores_() };
}

function getTopScores_() {
  const sheet = getSheet_();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];

  const rows = sheet.getRange(2, 1, lastRow - 1, 8).getValues();
  return rows
    .map(row => ({
      submittedAt: row[0] instanceof Date ? row[0].toISOString() : String(row[0] || ''),
      name: String(row[1] || 'Unnamed Team'),
      score: Number(row[2]) || 0,
      total: Number(row[3]) || 60,
      perfect: Number(row[4]) || 0,
      time: Number(row[5]) || 0,
      mode: String(row[6] || ''),
      date: String(row[7] || '')
    }))
    .sort((a, b) => (b.score - a.score) || (b.perfect - a.perfect) || (a.time - b.time))
    .slice(0, MAX_RETURNED_SCORES);
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Submitted At', 'Name', 'Score', 'Total', 'Perfect Rounds', 'Time ms', 'Mode', 'Browser Date']);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function output_(data, callback) {
  const json = JSON.stringify(data);
  if (callback) {
    const safeCallback = String(callback).replace(/[^A-Za-z0-9_.$]/g, '');
    return ContentService
      .createTextOutput(`${safeCallback}(${json});`)
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService
    .createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}

function clean_(value, maxLength) {
  return String(value).replace(/[\r\n\t]/g, ' ').trim().slice(0, maxLength);
}

function clampInt_(value, min, max) {
  const n = parseInt(value, 10);
  if (isNaN(n)) return min;
  return Math.max(min, Math.min(max, n));
}
