const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');

exports.handler = async function(event, context) {
  const { url } = event.queryStringParameters;

  if (!url) {
    return { statusCode: 400, body: JSON.stringify({ error: 'URL parameter is required.' }) };
  }

  let browser = null;
  try {
    // This function now ONLY fetches the clean text from the page.
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 25000 });
    
    const cleanPageText = await page.evaluate(() => document.body.innerText);

    if (!cleanPageText || cleanPageText.length < 100) {
      throw new Error("Failed to retrieve enough valid text content from the page.");
    }

    // It returns the plain text, not JSON.
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ textContent: cleanPageText }),
    };

  } catch (error) {
    console.error('Function Error:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Could not fetch the recipe text. Reason: ${error.message}` }),
    };
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
};
