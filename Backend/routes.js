const express = require('express');
const router = express.Router();
const axios = require('axios');
const fs = require('fs');
const multer = require("multer");
const Groq = require("groq-sdk");


// Gemini model (text generation)

const { GoogleGenerativeAI } = require('@google/generative-ai');
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

router.post('/api/generate', async (req, res) => {
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
        history: [],
    });

    try {
        const result = await chatSession.sendMessage(prompt);
        res.status(200).json({ response: result.response.text() });
    } catch (error) {
        res.status(500).json({ error: 'Error generating content' });
        console.error('Error generating response:', error);
    }

})


// Whisper model

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const upload = multer({ dest: 'uploads/' });

router.post('/transcribe', upload.single('audio'), async (req, res) => {

    console.log('Uploaded file:', req.file); // Log the received file information

    if (!req.file || !req.file.audio) {
        return res.status(400).json({ error: 'No audio file provided.' });
    }

    try {
        const transcription = await groq.audio.transcriptions.create({
            file: fs.createReadStream(req.file.path),
            model: "whisper-large-v3-turbo",
            response_format: "verbose_json",
        });
        res.json({ transcription: transcription.text });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Transcription failed." });
    } finally {
        fs.unlinkSync(req.file.path); // Remove the file after processing
    }
});


// LLama 3.2 90b model (text generation)

router.post('/chat', async (req, res) => {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: 'Invalid messages array.' });
    }

    // Transform messages to match the expected format
    const formattedMessages = messages.map((msg) => ({
        role: msg.role, // This should be 'user', 'assistant', etc.
        content: msg.text // Change 'text' to 'content'
    }));

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: formattedMessages,
            model: 'llama-3.2-90b-text-preview',
            temperature: 1,
            max_tokens: 1024,
            top_p: 1,
            stream: true,
            stop: null,
        });

        let response = '';

        for await (const chunk of chatCompletion) {
            response += chunk.choices[0]?.delta?.content || '';
        }

        res.json({ response }); // Send the complete response back to the client
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to generate chat completion.' });
    }
});


// Stable Diffusion (image generation)

router.post('/image/stablediffusion', async (req, res) => {

    if (!req.body.inputs) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    try {
        const response = await axios.post(
            "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3.5-large",
            { inputs: req.body.inputs },
            {
                headers: {
                    Authorization: process.env.HUGGING_FACE_KEY,
                    "Content-Type": "application/json",
                },
                responseType: 'arraybuffer', // Ensures we receive the response as a binary buffer
            }
        );

        const base64Image = Buffer.from(response.data, 'binary').toString('base64');
        res.status(201).json({ image: `data:image/png;base64,${base64Image}` });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: "Failed to create image" });
    }

})



// Black Forest (image generation)

router.post('/image/blackforest', async (req, res) => {

    if (!req.body.inputs) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    try {
        const response = await axios.post(
            "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
            { inputs: req.body.inputs },
            {
                headers: {
                    Authorization: process.env.HUGGING_FACE_KEY,
                    "Content-Type": "application/json",
                },
                responseType: 'arraybuffer', // Ensures we receive the response as a binary buffer
            }
        );

        const base64Image = Buffer.from(response.data, 'binary').toString('base64');
        res.status(201).json({ image: `data:image/png;base64,${base64Image}` });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: "Failed to create image" });
    }

})




module.exports = router;