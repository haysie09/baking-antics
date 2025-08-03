const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const { url } = event.queryStringParameters;

  if (!url) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'URL parameter is required.' }),
    };
  }

  try {
    // --- ADDED: Headers to mimic a real browser request ---
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
    };

    const response = await fetch(url, { headers: headers }); // Pass the headers with the request

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: `Failed to fetch from ${url}` }),
      };
    }
    
    const pageText = await response.text();

    return {
      statusCode: 200,
      body: JSON.stringify({ content: pageText }),
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not fetch the website content. It may be blocking requests.' }),
    };
  }
};
