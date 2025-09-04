import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

// 1. Configure environment variables
dotenv.config();

// 2. Initialize the Google AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.post('/api/parse', async (req, res) => {
  const { articleUrl } = req.body;
  if (!articleUrl) {
    return res.status(400).json({ error: 'articleUrl is required' });
  }

  try {
    // --- STAGE 1: FETCH AND CLEAN (Same as before) ---
    const response = await fetch(articleUrl);
    if (!response.ok) throw new Error(`Failed to fetch URL. Status: ${response.status}`);
    
    const html = await response.text();
    const doc = new JSDOM(html, { url: articleUrl });
    const reader = new Readability(doc.window.document);
    const article = reader.parse();

    if (!article || !article.textContent) {
      throw new Error('Could not parse the article content to summarize.');
    }
    
    // --- STAGE 2: PROMPT THE AI FOR SUMMARIZATION ---
    console.log("Sending cleaned text to Gemini AI...");

    // This is the "magic prompt" that tells the AI exactly what we want.
    const prompt = `
      You are an expert content summarizer. Based on the following article text, generate a concise summary in a structured JSON format. 
      The JSON object MUST have the following keys and data types:
      - "heading": A short, catchy title for the summary (string).
      - "descriptive_paragraph": A single, descriptive paragraph summarizing the main points (string).
      - "bullet_points": An array of 3 to 5 key takeaways or important facts (array of strings).
      - "neutral_opinion": A brief, neutral concluding thought or the core thesis of the article in one sentence (string).

      Do not include any introductory text like "Here is the JSON summary". Only output the raw JSON object.

      Article Text:
      ---
      ${article.textContent.slice(0, 10000)} 
    `; // We slice to ensure we don't exceed token limits.

    const result = await model.generateContent(prompt);
    const aiResponseText = await result.response.text();
    
    // Clean the AI response to ensure it's valid JSON
    const cleanedJsonString = aiResponseText.replace(/```json/g, '').replace(/```/g, '').trim();

    // 3. Parse the AI's JSON response and send it to the frontend
    const summaryJson = JSON.parse(cleanedJsonString);
    
    console.log("Successfully received summary from AI.");
    res.json(summaryJson);

  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'Failed to summarize the article. ' + error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:3001`);
});

