# Website Performance Monitor

This script monitors the performance of your portfolio website using Google PageSpeed Insights and logs the results to a Google Sheet.

## Setup

1. **Get a Google API Key:**
   - Go to the [Google Cloud Console](https://console.cloud.google.com/).
   - Create a new project or select an existing one.
   - Enable the PageSpeed Insights API and Google Sheets API.
   - Create an API key in the Credentials section.

2. **Create a Google Sheet:**
   - Create a new Google Sheet.
   - Note the Spreadsheet ID from the URL (the long string between /d/ and /edit).
   - Add headers in row 1: Date, URL, Performance Score, First Contentful Paint, Largest Contentful Paint, Cumulative Layout Shift, Total Blocking Time, Speed Index.

3. **Set up Service Account for Sheets:**
   - In Google Cloud Console, go to IAM & Admin > Service Accounts.
   - Create a new service account.
   - Generate a key (JSON) and download it as `service-account-key.json` in this directory.
   - Share the Google Sheet with the service account email (found in the JSON file under `client_email`).

4. **Install Dependencies:**
   ```
   npm install
   ```

5. **Configure the Script:**
   - Edit `index.js`:
     - Replace `'YOUR_API_KEY_HERE'` with your API key.
     - Replace `'YOUR_SPREADSHEET_ID_HERE'` with your Sheet ID.
     - Change `WEBSITE_URL` to your website's URL (must be publicly accessible for PageSpeed API).

6. **Run the Script:**
   ```
   npm start
   ```

## Automation

To run periodically, use a scheduler like cron (on Linux/Mac) or Task Scheduler (on Windows).

For example, to run daily:
- On Windows: Use Task Scheduler to run `node index.js` daily.

## Notes

- The website must be accessible online for PageSpeed Insights to work.
- If your site is local, host it using `npx http-server` or similar and use the local URL (e.g., http://localhost:8080/portfolio2.html).