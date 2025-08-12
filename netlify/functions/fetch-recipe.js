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

exports.handler = async function(event, context) {
    const { url } = event.queryStringParameters;
    const apiKey = process.env.GEMINI_API_KEY || "";

    if (!url) return { statusCode: 400, body: JSON.stringify({ error: 'URL is required.' }) };
    if (!apiKey) return { statusCode: 500, body: JSON.stringify({ error: 'API key is not configured.' }) };

    let browser = null;
    try {
        // --- Step 1: Fetch HTML ---
        browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
            ignoreHTTPSErrors: true,
        });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 25000 });
        const siteHtml = await page.content();
        if (!siteHtml) throw new Error("Failed to retrieve page content.");

        // --- Step 2: AI Structuring ---
        const structuringPayload = {
            contents: [{ parts: [{ text: `From the following HTML, extract the recipe title, ingredients, and instructions. HTML: "${siteHtml}"` }] }],
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
        let recipeData = JSON.parse(structuringResult.candidates[0].content.parts[0].text);

        // --- Step 3: AI Formatting ---
        if (recipeData.instructions) {
            const formattingPayload = {
                contents: [{ parts: [{ text: `Reformat the following recipe instructions into a clean, numbered list. Instructions: "${recipeData.instructions}"` }] }]
            };
            const formattingResult = await callGemini(apiKey, formattingPayload);
            recipeData.instructions = formattingResult.candidates[0].content.parts[0].text;
        }

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(recipeData),
        };

    } catch (error) {
        console.error('Function Error:', error.message);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: `Could not process the recipe. Reason: ${error.message}` }),
        };
    } finally {
        if (browser) await browser.close();
    }
};
