require("dotenv").config();
const axios = require("axios");

const OLLAMA_URL = process.env.OLLAMA_URL;
const MODEL = process.env.MODEL;

async function askAI(prompt) {
    try {
        const response = await axios.post(`${OLLAMA_URL}/api/generate`, {
        model: MODEL,
        prompt: prompt,
        stream: false
        });

        return response.data.response;
    } catch (error) {
        console.error("Ollama error:", error.message);
        return "Error contacting AI";
    }
}

module.exports = askAI;