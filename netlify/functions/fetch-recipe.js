const chromium = require('@sparticuz/chromium');
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
    // Add recommended flags for serverless environments
    await chromium.font('https://raw.githack.com/googlei18n/noto-cjk/main/NotoSansCJK-Regular.ttc');
    
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();
    
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    // Increase the timeout to 30 seconds to handle slower sites
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

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
    if (browser !== null) {
      try {
        await browser.close();
      } catch (e) {
        console.error('Error closing browser:', e);
      }
    }
  }
};
