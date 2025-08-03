// 1. Use the new, modern packages
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
    // 2. The launch configuration is slightly different for the new package
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    await page.goto(url, { waitUntil: 'networkidle2' });

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
      await browser.close();
    }
  }
};
