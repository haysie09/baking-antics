const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');
const fetch = require('node-fetch');

async function callGemini(apiKey, payload) {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        const errorBody = await response.json();
        console.error("AI API Error:", JSON.stringify(errorBody, null, 2));
        throw new Error(`AI API request failed: ${errorBody.error.message}`);
    }
    return response.json();
}

// --- NEW: Fast fetch function ---
async function fetchWithNode(url) {
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    };
    const response = await fetch(url, { headers });
    if (!response.ok) throw new Error("Simple fetch failed.");
    return response.text();
}

// --- NEW: Powerful browser function ---
async function fetchWithPuppeteer(url) {
    let browser = null;
    try {
        browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
            ignoreHTTPSErrors: true,
        });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 25000 });
        return page.evaluate(() => document.body.innerText);
    } finally {
        if (browser) await browser.close();
    }
}


exports.handler = async function(event, context) {
    const { url } = event.queryStringParameters;
    const apiKey = process.env.GEMINI_API_KEY || "";

    if (!url) return { statusCode: 400, body: JSON.stringify({ error: 'URL is required.' }) };
    if (!apiKey) return { statusCode: 500, body: JSON.stringify({ error: 'API key is not configured.' }) };

    try {
        let cleanPageText;
        console.log("Attempting fast fetch...");
        try {
            // --- Try the fast way first ---
            cleanPageText = await fetchWithNode(url);
            console.log("Fast fetch successful.");
        } catch (e) {
            console.log("Fast fetch failed, falling back to browser...");
            // --- Fallback to the powerful way ---
            cleanPageText = await fetchWithPuppeteer(url);
            console.log("Browser fetch successful.");
        }

        if (!cleanPageText || cleanPageText.length < 100) {
            throw new Error("Failed to retrieve enough valid text content from the page.");
        }

        // --- AI Structuring (only one step needed now) ---
        console.log("Sending text to AI for structuring...");
        const structuringPayload = {
            contents: [{ parts: [{ text: `Analyze the following recipe text and provide the output in a valid JSON format. Recipe Text: "${cleanPageText}"` }] }],
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "OBJECT",
                    properties: {
                        recipeTitle: { type: "STRING" },
                        ingredients: { type: "ARRAY", items: { type: "OBJECT", properties: { quantity: { type: "STRING" }, measurement: { type: "STRING" }, name: { type: "STRING" } }, required: ["name"] } },
                        instructions: { type: "STRING" }
                    },
                    required: ["recipeTitle", "ingredients", "instructions"]
                }
            }
        };
        const structuringResult = await callGemini(apiKey, structuringPayload);
        const recipeJsonText = structuringResult.candidates[0].content.parts[0].text;
        
        JSON.parse(recipeJsonText); // Validate JSON before returning

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: recipeJsonText,
        };

    } catch (error) {
        console.error('Function Error:', error.message);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: `Could not process the recipe. Reason: ${error.message}` }),
        };
    }
};
