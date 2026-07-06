const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '../.env') });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL_NAME = 'gemini-2.5-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;

/**
 * Helper to call Gemini API
 * @param {string} prompt - Prompt to send
 * @param {boolean} forceJson - Whether to force JSON output
 */
async function callGemini(prompt, forceJson = true) {
    if (!GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY is not defined in environment variables');
    }

    const requestBody = {
        contents: [
            {
                parts: [
                    { text: prompt }
                ]
            }
        ]
    };

    if (forceJson) {
        requestBody.generationConfig = {
            responseMimeType: 'application/json'
        };
    }

    try {
        const response = await fetch(GEMINI_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errData = await response.json();
            console.error('Gemini API error response:', errData);
            throw new Error(`Gemini API returned status ${response.status}: ${errData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        
        const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!candidateText) {
            throw new Error('Invalid or empty response from Gemini API');
        }

        return forceJson ? JSON.parse(candidateText.trim()) : candidateText.trim();
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        throw error;
    }
}

/**
 * Sourced questions from Gemini AI for a domain and difficulty
 * @param {string} domain - Interview domain (e.g. Frontend Development)
 * @param {string} difficulty - Easy, Medium, or Hard
 * @param {number} count - Number of questions to generate
 */
async function generateAIQuestions(domain, difficulty, count = 3) {
    const prompt = `
Generate exactly ${count} professional interview questions for the domain '${domain}' at a '${difficulty}' difficulty level.
For each question, generate:
1. "questionText": A clear, concise question that tests the candidate's understanding of key concepts in the domain.
2. "idealAnswer": A complete, detailed ideal answer that defines key terms, concepts, and provides code examples or scenarios where appropriate.
3. "tips": 2-3 specific, actionable points the candidate should focus on or mention when answering this question.

Return the result strictly as a JSON array of objects with the keys: "questionText", "idealAnswer", "tips".
Do not include any wrapper markdown or commentary outside the JSON array.
`;

    return await callGemini(prompt, true);
}

/**
 * Evaluate a user's answer using Gemini AI
 * @param {object} question - Question object containing questionText and idealAnswer
 * @param {string} userAnswer - User's submitted response
 * @param {string} difficulty - Easy, Medium, or Hard
 */
async function evaluateAIResponse(question, userAnswer, difficulty) {
    const prompt = `
You are an expert interviewer evaluating a candidate's response.
Question: "${question.questionText}"
Ideal expected answer: "${question.idealAnswer}"
Difficulty: "${difficulty}"

Candidate's Answer: "${userAnswer}"

Evaluate the candidate's answer thoroughly based on clarity, correctness, and completeness relative to the ideal answer.
Determine:
1. "score": An integer score from 0 to 100 representing how well the candidate answered. Be fair but objective. If the answer is completely blank or unrelated, give 0.
2. "feedback": A detailed, constructive feedback paragraph. Highlight what they got right, what crucial points they missed, and exactly how they can improve their response.

Return the result strictly as a JSON object with the keys: "score", "feedback".
Do not include any wrapper markdown or commentary outside the JSON object.
`;

    return await callGemini(prompt, true);
}

/**
 * Generate AI-based dashboard recommendations
 * @param {Array} categoryPerformance - Array of category performance scores
 * @param {Array} mockHistorySummary - Recent mock interview details
 */
async function generateAISuggestions(categoryPerformance, mockHistorySummary) {
    const prompt = `
You are an expert AI Career Coach and Interview Mentor. Based on the candidate's performance data, generate exactly 3 to 4 highly personalized, actionable improvement recommendations.

Candidate Performance Data:
- Practice Category Scores: ${JSON.stringify(categoryPerformance)}
- Recent Mock Interviews: ${JSON.stringify(mockHistorySummary)}

For each recommendation, provide:
1. "type": A category/tag for the recommendation (e.g., "technical-skill", "communication", "confidence", "consistency").
2. "title": A concise, encouraging title.
3. "description": A short, clear, 2-3 line actionable recommendation (strictly keep it under 150 characters and to-the-point). Do not write big paragraphs.
4. "priority": "high", "medium", or "low".

Return the result strictly as a JSON array of objects with the keys: "type", "title", "description", "priority".
Do not include any wrapper markdown or commentary outside the JSON array.
`;

    return await callGemini(prompt, true);
}

module.exports = {
    generateAIQuestions,
    evaluateAIResponse,
    generateAISuggestions
};
