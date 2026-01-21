// Test script for Google Sheets and OpenAI credentials
require('dotenv').config({ path: '.env.local' });
const { google } = require('googleapis');

async function testCredentials() {
  console.log('🧪 Testing credentials...\n');

  // Test Google Sheets
  console.log('📊 Testing Google Sheets...');
  try {
    const credentials = process.env.GOOGLE_CREDENTIALS;
    if (!credentials) {
      console.log('❌ GOOGLE_CREDENTIALS not set');
    } else {
      const decodedCredentials = JSON.parse(
        Buffer.from(credentials, 'base64').toString('utf-8')
      );
      console.log('✅ Credentials decoded successfully');
      console.log(`   Service Account: ${decodedCredentials.client_email}`);

      const auth = new google.auth.GoogleAuth({
        credentials: decodedCredentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      const sheets = google.sheets({ version: 'v4', auth });
      const sheetId = process.env.GOOGLE_SHEET_ID;

      // Try to read the sheet
      const response = await sheets.spreadsheets.get({
        spreadsheetId: sheetId,
      });

      console.log(`✅ Connected to sheet: "${response.data.properties.title}"`);

      // Try to write a test row
      await sheets.spreadsheets.values.append({
        spreadsheetId: sheetId,
        range: 'Sheet1!A:F',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [['TEST_SESSION', new Date().toISOString(), 'Test User', 'test', 'Test question?', 'Test answer']],
        },
      });
      console.log('✅ Successfully wrote test row to sheet');
    }
  } catch (error) {
    console.log('❌ Google Sheets error:', error.message);
  }

  // Test OpenAI
  console.log('\n🤖 Testing OpenAI...');
  try {
    const OpenAI = require('openai').default;
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: 'Say "test passed" in Italian' }],
      max_tokens: 20,
    });

    console.log(`✅ OpenAI response: ${response.choices[0].message.content}`);
  } catch (error) {
    console.log('❌ OpenAI error:', error.message);
  }

  console.log('\n✨ Test complete!');
}

testCredentials();
