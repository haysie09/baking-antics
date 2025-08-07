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
            console.error("AI API Error:", errorBody);
            throw new Error(`AI API request failed with status ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw error;
    }
}

exports.handler = async function(event, context) {
    console.log("Function started.");
    const { url } = event.queryStringParameters;
    const apiKey = process.env.GEMINI_API_KEY || ""; 

    if (!url) {
        console.log("Error: URL parameter is missing.");
        return { statusCode: 400, body: JSON.stringify({ error: 'URL parameter is required.' }) };
    }
    console.log(`Received URL: ${url}`);

    let browser = null;
    try {
        // --- Step 1: Fetch and Clean HTML ---
        console.log("Step 1: Launching headless browser...");
        await chromium.font('https://raw.githack.com/googlei18n/noto-cjk/main/NotoSansCJK-Regular.ttc');
        browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
            ignoreHTTPSErrors: true,
        });
        console.log("Browser launched successfully.");

        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        console.log(`Navigating to page: ${url}`);
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
        console.log("Page navigation successful.");
        
        const cleanPageText = await page.evaluate(() => document.body.innerText);
        console.log(`Successfully extracted page text (length: ${cleanPageText.length}).`);

        if (!cleanPageText || cleanPageText.length < 100) {
            throw new Error("Failed to retrieve enough valid text content from the page.");
        }

        // --- Step 2: AI Structuring ---
        console.log("Step 2: Sending clean text to AI for structuring...");
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
        console.log("AI structuring successful. Final JSON created.");

        JSON.parse(recipeJsonText);

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: recipeJsonText,
        };

    } catch (error) {
        console.error('Function Error:', error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Could not fetch or process the recipe from the website.' }),
        };
    } finally {
        if (browser !== null) {
            console.log("Closing browser.");
            await browser.close();
        }
        console.log("Function finished.");
    }
};
