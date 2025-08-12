const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');
const fetch = require('node-fetch');

async function callGemini(apiKey, payload) {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            const errorBody = await response.json();
            console.error("AI API Error:", JSON.stringify(errorBody, null, 2));
            throw new Error(`AI API request failed with status ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error("Error during Gemini API call:", error);
        throw error;
    }
}

exports.handler = async function(event, context) {
    console.log("Function invocation started.");
    const { url } = event.queryStringParameters;
    const apiKey = process.env.GEMINI_API_KEY || ""; 

    console.log(`API Key loaded with length: ${apiKey.length}`);
    if (apiKey.length === 0) {
        console.error("FATAL: GEMINI_API_KEY environment variable is not set.");
        return { statusCode: 500, body: JSON.stringify({ error: 'Server configuration error: API key is missing.' }) };
    }

    if (!url) {
        return { statusCode: 400, body: JSON.stringify({ error: 'URL parameter is required.' }) };
    }

    let browser = null;
    try {
        console.log("Step 1: Launching browser...");
        browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
            ignoreHTTPSErrors: true,
        });
        console.log("Browser launched.");

        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        
        console.log(`Navigating to ${url}...`);
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 25000 }); // Slightly less than the function timeout
        console.log("Page navigation complete.");
        
        const cleanPageText = await page.evaluate(() => document.body.innerText);
        console.log(`Extracted page text. Length: ${cleanPageText.length}`);

        if (!cleanPageText || cleanPageText.length < 100) {
            throw new Error("Failed to retrieve enough valid text content.");
        }

        console.log("Step 2: Sending text to AI for structuring...");
        const structuringPayload = {
            contents: [{
                parts: [{ text: `Analyze the following recipe text and provide the output in a valid JSON format. Recipe Text: "${cleanPageText}"` }]
            }],
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "OBJECT",
                    properties: {
                        recipeTitle: { type: "STRING" },
                        ingredients: {
                            type: "ARRAY",
                            items: {
                                type: "OBJECT",
                                properties: {
                                    quantity: { type: "STRING" },
                                    measurement: { type: "STRING" },
                                    name: { type: "STRING" }
                                },
                                required: ["name"]
                            }
                        },
                        instructions: { type: "STRING" }
                    },
                    required: ["recipeTitle", "ingredients", "instructions"]
                }
            }
        };
        const structuringResult = await callGemini(apiKey, structuringPayload);
        const recipeJsonText = structuringResult.candidates[0].content.parts[0].text;
        console.log("AI structuring successful.");

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: recipeJsonText,
        };

    } catch (error) {
        console.error('Caught Function Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: `An error occurred: ${error.message}` }),
        };
    } finally {
        if (browser !== null) {
            await browser.close();
            console.log("Browser closed.");
        }
        console.log("Function invocation finished.");
    }
};
