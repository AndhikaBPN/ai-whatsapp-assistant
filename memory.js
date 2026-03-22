const fs = require("fs");
const path = require("path");

const MEMORY_FILE = path.join(__dirname, "memory.json");

// load memory dari file
function loadMemory() {
    if (!fs.existsSync(MEMORY_FILE)) {
        fs.writeFileSync(MEMORY_FILE, JSON.stringify({}));
    }

    const data = fs.readFileSync(MEMORY_FILE, "utf-8");
    return JSON.parse(data || "{}");
}

// save memory ke file
function saveMemory(memory) {
    fs.writeFileSync(MEMORY_FILE, JSON.stringify(memory, null, 2));
}

function getHistory(userId) {
    const memory = loadMemory();
    
    if (!memory[userId]) {
        memory[userId] = [
        {
            role: "system",
            content: "Kamu adalah AI assistant WhatsApp yang ramah, singkat, dan membantu. gunakan bahasa indonesia yang gaul dan tidak baku untuk berkomunikasi!"
        }
        ];
        saveMemory(memory);
    }
    return memory[userId];
}

function addMessage(userId, role, content) {
    const memory = loadMemory();

    if (!memory[userId]) {
        memory[userId] = [];
    }

    memory[userId].push({ role, content });

    // limit memory (biar tidak berat)
    if (memory[userId].length > 10) {
        memory[userId].shift();
    }

    saveMemory(memory);
}

function setPersonality(userId, personality) {
    const memory = loadMemory();

    memory[userId] = [
        {
            role: "system",
            content: personality
        },
    ];

    saveMemory(memory);
}

function resetMemory(userId) {
    const memory = loadMemory();
    delete memory[userId];
    saveMemory(memory);
}

module.exports = {
    getHistory,
    addMessage,
    resetMemory,
    setPersonality
};