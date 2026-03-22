require("dotenv").config();
const axios = require("axios");
const { searchKnowledge } = require("./retriever");

const OLLAMA_URL = process.env.OLLAMA_URL;
const MODEL = process.env.MODEL;

async function askAI(messages, userQuery) {
    try {

        const knowledge = searchKnowledge(userQuery);

        const prompt = `
    Gunakan informasi berikut jika relevan:

    ${knowledge}

    ---------------------

    ${messages.map(m => `${m.role}: ${m.content}`).join("\n")}
    `;

        const response = await axios.post(`${OLLAMA_URL}/api/generate`, {
            model: MODEL,
            prompt,
            stream: false
        });

        return response.data.response;

    } catch (error) {
        console.error("Ollama error:", error.message);
        return "AI error";
    }
}

module.exports = askAI;