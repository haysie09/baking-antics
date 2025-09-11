// Filename: netlify/functions/fetch-recipe.js

const fetch = require('node-fetch');
const cheerio = require('cheerio');

// This is the Google Gemini API call function, it remains unchanged.
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

// This is the main handler function, now much faster and lighter.
exports.handler = async function(event, context) {
    const { url } = event.queryStringParameters;
    const apiKey = process.env.GEMINI_API_KEY || "";

    if (!url) return { statusCode: 400, body: JSON.stringify({ error: 'URL is required.' }) };
    if (!apiKey) return { statusCode: 500, body: JSON.stringify({ error: 'API key is not configured.' }) };

    try {
        // --- 1. FASTER FETCHING ---
        // Instead of launching a slow browser, we fetch the HTML directly.
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch the URL. Status: ${response.status}`);
        }
        const siteHtml = await response.text();
        if (!siteHtml) throw new Error("Failed to retrieve page content.");

        // --- 2. SMARTER SCRAPING ---
        const $ = cheerio.load(siteHtml);

        // A prioritized list of CSS selectors to find the main recipe content.
        const selectors = [
            '[itemtype*="schema.org/Recipe"]',
            '.recipe-container',
            '.recipe__main', // For sites like Edmonds
            '.article-content', // For sites like Maimoa
            'article.recipe',
            'article', // A generic fallback
        ];
        
        let recipeContent = '';
        for (const selector of selectors) {
            if ($(selector).length > 0) {
                recipeContent = $(selector).text();
                break; // Stop when we find the first match
            }
        }

        if (!recipeContent) {
            throw new Error("Could not find a valid recipe container on the page.");
        }
        
        const cleanedText = recipeContent.replace(/\s\s+/g, ' ').trim();

        // --- 3. AI PROCESSING (Unchanged) ---
        const payload = {
            contents: [{ 
                parts: [{ 
                    text: `From the following text, extract the recipe title, ingredients, and instructions. Format the instructions as a simple array of strings, where each string is a single step. Here is the text: "${cleanedText}"` 
                }] 
            }],
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "OBJECT",
                    properties: {
                        recipeTitle: { type: "STRING" },
                        ingredients: { type: "ARRAY", items: { type: "OBJECT", properties: { quantity: { type: "STRING" }, measurement: { type: "STRING" }, name: { type: "STRING" } }, required: ["name"] } },
                        instructions: { type: "ARRAY", items: { type: "STRING" } }
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
    }
};