const fs = require("fs");
const path = require("path");

const KNOWLEDGE_PATH = path.join(__dirname, "knowledge");

function searchKnowledge(query) {
    const files = fs.readdirSync(KNOWLEDGE_PATH);

    let results = [];

    for (const file of files) {
        const content = fs.readFileSync(
        path.join(KNOWLEDGE_PATH, file),
        "utf-8"
        );

        if (content.toLowerCase().includes(query.toLowerCase())) {
        results.push(content);
        }
    }

    return results.join("\n");
}

module.exports = { searchKnowledge };