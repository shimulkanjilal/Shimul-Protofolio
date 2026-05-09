const axios = require('axios');
const { google } = require('googleapis');

// Replace with your Google API key
const API_KEY = process.env.GOOGLE_API_KEY || 'YOUR_API_KEY_HERE';

// Replace with your Google Sheets ID
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';

// Path to your service account key file
const KEY_FILE_PATH = './service-account-key.json';

// URL of the website to test
const WEBSITE_URL = 'file:///d:/My%20Project%20Point/sk/portfolio2.html'; // Adjust path

async function getPageSpeedData(url) {
  const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${API_KEY}`;
  try {
    const response = await axios.get(apiUrl);
    const data = response.data;
    const lighthouse = data.lighthouseResult;
    const audits = lighthouse.audits;

    return {
      date: new Date().toISOString(),
      url: url,
      performance_score: lighthouse.categories.performance.score * 100,
      first_contentful_paint: audits['first-contentful-paint']?.displayValue || 'N/A',
      largest_contentful_paint: audits['largest-contentful-paint']?.displayValue || 'N/A',
      cumulative_layout_shift: audits['cumulative-layout-shift']?.displayValue || 'N/A',
      total_blocking_time: audits['total-blocking-time']?.displayValue || 'N/A',
      speed_index: audits['speed-index']?.displayValue || 'N/A'
    };
  } catch (error) {
    console.error('Error fetching PageSpeed data:', error.message);
    return null;
  }
}

async function appendToSheet(data) {
  const auth = new google.auth.GoogleAuth({
    keyFile: KEY_FILE_PATH,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  const values = [
    [
      data.date,
      data.url,
      data.performance_score,
      data.first_contentful_paint,
      data.largest_contentful_paint,
      data.cumulative_layout_shift,
      data.total_blocking_time,
      data.speed_index
    ]
  ];

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet1!A:H', // Adjust range as needed
      valueInputOption: 'RAW',
      resource: { values },
    });
    console.log('Data appended to Google Sheet successfully.');
  } catch (error) {
    console.error('Error appending to sheet:', error.message);
  }
}

async function main() {
  const data = await getPageSpeedData(WEBSITE_URL);
  if (data) {
    await appendToSheet(data);
  }
}

main();