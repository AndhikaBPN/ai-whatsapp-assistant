const {
    default: makeWASocket,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    DisconnectReason
} = require("@whiskeysockets/baileys");

const qrcode = require("qrcode-terminal");
const askAI = require("./ollama");
const { getHistory, addMessage, resetMemory } = require("./memory");
const handleCommand = require("./command");

async function startWhatsAppBot() {

    const { state, saveCreds } = await useMultiFileAuthState("auth");
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        auth: state,
        version,
        browser: ["Ubuntu", "Chrome", "20.0.04"]
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", (update) => {
        const { qr, connection, lastDisconnect } = update;

        if (qr) {
            console.log("Scan QR code below:");
            qrcode.generate(qr, { small: true });
        }

        if (connection === "open") {
            console.log("WhatsApp bot connected ✅");
        }

        if (connection === "close") {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;

            if (shouldReconnect) {
                startWhatsAppBot();
            }
        }
    });

    sock.ev.on("messages.upsert", async ({ messages }) => {

        const msg = messages[0];

        if (!msg) return;
        if (!msg.message) return;
        if (msg.key.fromMe) return;

        const text =
        msg.message?.conversation ||
        msg.message?.extendedTextMessage?.text;

        if (!text) return;

        // =======================
        // COMMAND HANDLER
        // =======================
        
        const sender = msg.key.remoteJid;

        const isCommand = await handleCommand(text, sender, sock);
        if (isCommand) return;

        console.log("User:", text);

        // const aiResponse = await askAI(text);

        // tambah user message
        addMessage(sender, "user", text);

        // ambil history terbaru
        const updatedHistory = getHistory(sender);
        const aiResponse = await askAI(updatedHistory, text);

        // simpan response AI
        addMessage(sender, "assistant", aiResponse);

        console.log("AI:", aiResponse);
        await sock.sendMessage(sender, {
            text: aiResponse
        });

    });
}

module.exports = startWhatsAppBot;