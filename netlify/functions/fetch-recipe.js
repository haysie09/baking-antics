const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

exports.handler = async function(event, context) {
  const { url } = event.queryStringParameters;

  if (!url) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'URL parameter is required.' }),
    };
  }

  let browser = null;
  try {
    // Launch a headless browser instance
    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    
    // Set a realistic user agent to avoid being blocked
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    // Navigate to the URL and wait for the page to be fully loaded (including JavaScript)
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Extract the full HTML content of the page after JavaScript has run
    const pageContent = await page.content();

    return {
      statusCode: 200,
      body: JSON.stringify({ content: pageContent }),
    };

  } catch (error) {
    console.error('Puppeteer error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not fetch or process the website content.' }),
    };
  } finally {
    // Ensure the browser is closed even if an error occurs
    if (browser !== null) {
      await browser.close();
    }
  }
};
