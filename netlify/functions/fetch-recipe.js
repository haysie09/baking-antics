// Filename: netlify/functions/fetch-recipe.js

const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

async function callGemini(apiKey, payload) {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
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
        browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
            ignoreHTTPSErrors: true,
        });

        const page = await browser.newPage();

        // --- OPTIMIZATIONS ---
        // 1. Set a realistic User-Agent to mimic a real browser
        await page.setUserAgent(
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        );

        // 2. Block images and CSS to speed up loading
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            if(['image', 'stylesheet', 'font'].includes(req.resourceType())){
                req.abort();
            } else {
                req.continue();
            }
        });
        
        // 3. Go to the page with an increased timeout
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 }); 
        const siteHtml = await page.content();
        if (!siteHtml) throw new Error("Failed to retrieve page content.");

        // --- PROCESSING (Unchanged) ---
        const $ = cheerio.load(siteHtml);
        const recipeContent = $('[itemtype*="schema.org/Recipe"]').html() || $('article.recipe').html() || $('body').text();
        const cleanedText = recipeContent.replace(/\s\s+/g, ' ').trim();

        const payload = {
            contents: [{ 
                parts: [{ 
                    text: `From the following text, extract the recipe. Ensure the instructions are a simple array of strings, with each string being one step. Text: "${cleanedText}"` 
                }] 
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
                        instructions: { 
                            type: "ARRAY",
                            items: { type: "STRING" }
                        }
                    },
                    required: ["recipeTitle", "ingredients", "instructions"]
                }
            }
        };

        const result = await callGemini(apiKey, payload);
        let recipeData = JSON.parse(result.candidates[0].content.parts[0].text);

        if (Array.isArray(recipeData.instructions)) {
            recipeData.instructions = recipeData.instructions.join('\n');
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