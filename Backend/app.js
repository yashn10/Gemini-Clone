const express = require('express');
const app = express();
require('dotenv').config({ path: "./config.env" })
const cors = require('cors');
const port = process.env.PORT || 8000

const { GoogleGenerativeAI } = require('@google/generative-ai');
const apiKey = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

app.use(express.json());

app.use(cors({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'OPTIONS', 'DELETE', 'PUT', 'PATCH'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept'],
    credentials: true // Enable credentials
}));


app.post('/api/generate', async (req, res) => {
    const { prompt } = req.body; // Extract the prompt as a string

    if (!prompt || typeof prompt !== "string") {
        return res.status(400).json({ error: 'Invalid prompt format. Expected a string.' });
    }

    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
    });

    const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
        responseMimeType: "text/plain",
    };

    const chatSession = model.startChat({
        generationConfig,
        // safetySettings: Adjust safety settings
        // See https://ai.google.dev/gemini-api/docs/safety-settings
        history: [],
    });

    try {
        const result = await chatSession.sendMessage(prompt);
        res.status(200).json({ response: result.response.text() });
        // console.log(result.response.text());
    } catch (error) {
        res.status(500).json({ error: 'Error generating content' });
        console.error('Error generating response:', error);
    }

})


app.listen(port, () => {
    console.log(`Server running at port number: ${port}`);
})
