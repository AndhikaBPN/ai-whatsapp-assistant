const startWhatsAppBot = require("./whatsapp");
const { loadPDFs } = require("./pdfLoader");

async function main() {
    await loadPDFs(); // ⬅️ load PDF dulu
    startWhatsAppBot();
}

main();