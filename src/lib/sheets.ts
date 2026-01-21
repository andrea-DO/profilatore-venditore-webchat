import { google } from 'googleapis';
import { TranscriptEntry } from '@/types';

function getGoogleAuth() {
  const credentials = process.env.GOOGLE_CREDENTIALS;
  if (!credentials) {
    console.warn('GOOGLE_CREDENTIALS not configured, skipping Google Sheets');
    return null;
  }

  try {
    const decodedCredentials = JSON.parse(
      Buffer.from(credentials, 'base64').toString('utf-8')
    );

    return new google.auth.GoogleAuth({
      credentials: decodedCredentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
  } catch (error) {
    console.error('Failed to parse Google credentials:', error);
    return null;
  }
}

export async function saveTranscriptToSheets(
  sessionId: string,
  userName: string,
  transcript: TranscriptEntry[]
): Promise<boolean> {
  const auth = getGoogleAuth();
  if (!auth) return false;

  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!sheetId) {
    console.warn('GOOGLE_SHEET_ID not configured');
    return false;
  }

  try {
    const sheets = google.sheets({ version: 'v4', auth });

    // Prepare rows for the sheet
    const rows = transcript.map((entry) => [
      sessionId,
      entry.timestamp,
      userName,
      entry.type,
      entry.question || '',
      entry.answer || '',
    ]);

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'Sheet1!A:F',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: rows,
      },
    });

    console.log(`Saved ${rows.length} transcript entries to Google Sheets`);
    return true;
  } catch (error) {
    console.error('Failed to save to Google Sheets:', error);
    return false;
  }
}
