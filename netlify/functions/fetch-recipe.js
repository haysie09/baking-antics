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
        console.error("AI API Error:", errorBody);
        throw new Error(`AI API request failed with status ${response.status}`);
    }
    return response.json();
}

exports.handler = async function(event, context) {
    console.log("Function started.");
    const { url } = event.queryStringParameters;
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY || "";

    if (!url) {
        console.log("Error: URL parameter is missing.");
        return { statusCode: 400, body: JSON.stringify({ error: 'URL parameter is required.' }) };
    }
    console.log(`Received URL: ${url}`);

    let browser = null;
    try {
        // --- Step 1: Fetch the Raw HTML ---
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
        const siteHtml = await page.content();
        console.log(`Successfully fetched HTML content (length: ${siteHtml.length}).`);

        // --- Step 2: AI as a "Cleaner" ---
        console.log("Step 2: Sending HTML to AI for cleaning...");
        const cleaningPayload = {
            contents: [{
                parts: [{ text: `From the following HTML content, extract only the main recipe text, including its title, ingredients list, and instructions. Return only the clean, plain text, with no HTML tags. HTML: "${siteHtml}"` }]
            }]
        };
        const cleaningResult = await callGemini(apiKey, cleaningPayload);
        const cleanRecipeText = cleaningResult.candidates[0].content.parts[0].text;
        console.log(`AI cleaning successful. Clean text length: ${cleanRecipeText.length}`);

        if (!cleanRecipeText || cleanRecipeText.length < 50) {
             throw new Error("AI could not find a valid recipe in the cleaned content.");
        }

        // --- Step 3: AI as a "Structurer" ---
        console.log("Step 3: Sending clean text to AI for structuring...");
        const structuringPayload = {
            contents: [{
                parts: [{ text: `Analyze the following recipe text and provide the output in a valid JSON format. Recipe Text: "${cleanRecipeText}"` }]
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

        return {
            statusCode: 200,
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
