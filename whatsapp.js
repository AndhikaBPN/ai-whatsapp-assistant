const {
    default: makeWASocket,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    DisconnectReason
} = require("@whiskeysockets/baileys");

const qrcode = require("qrcode-terminal");
const askAI = require("./ollama");

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

        if (!msg.message) return;
        if (msg.key.fromMe) return;

        const text =
        msg.message.conversation ||
        msg.message.extendedTextMessage?.text;

        if (!text) return;

        const sender = msg.key.remoteJid;

        console.log("User:", text);

        const aiResponse = await askAI(text);

        console.log("AI:", aiResponse);

        await sock.sendMessage(sender, {
            text: aiResponse
        });

    });
}

module.exports = startWhatsAppBot;