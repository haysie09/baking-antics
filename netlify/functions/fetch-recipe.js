// This is a Node.js function, so it uses `require` instead of `import`
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  // Get the URL from the query string, e.g., /.netlify/functions/fetch-recipe?url=...
  const { url } = event.queryStringParameters;

  if (!url) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'URL parameter is required.' }),
    };
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      // If the website returns an error (like 404 Not Found), pass it along
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: `Failed to fetch from ${url}` }),
      };
    }
    
    // Get the raw HTML text of the website
    const pageText = await response.text();

    // Send the text back to our React app
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
