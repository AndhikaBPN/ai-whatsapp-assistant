const fs = require("fs");
const path = require("path");
const pdf = require("pdf-parse");

const PDF_PATH = path.join(__dirname, "pdf");
const KNOWLEDGE_PATH = path.join(__dirname, "knowledge");

async function loadPDFs() {
    const files = fs.readdirSync(PDF_PATH);

    for (const file of files) {
        if (!file.endsWith(".pdf")) continue;

        const filePath = path.join(PDF_PATH, file);
        const dataBuffer = fs.readFileSync(filePath);

        const data = await pdf(dataBuffer);

        const outputFile = file.replace(".pdf", ".txt");

        fs.writeFileSync(
        path.join(KNOWLEDGE_PATH, outputFile),
        data.text
        );

        console.log(`Loaded PDF: ${file}`);
    }
}

module.exports = { loadPDFs };