const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Configure OpenAI API

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});



app.post('/chat', async (req, res) => {
    const { message } = req.body;

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                {
                    role: "user",
                    content: "Write a haiku about recursion in programming.",
                },
            ],
        });
        console.log('ChatGPT Response:', response);
        res.json({ reply: response.data.choices[0].message.content });
    } catch (error) {
        console.error("Error communicating with OpenAI:", error.message);
        res.status(500).json({ error: "Error communicating with ChatGPT. Please try again later." });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
  
