const { resetMemory } = require("./memory");
const { setPersonality } = require("./memory");
const { getPersonality } = require("./personality");

async function handleCommand(text, sender, sock) {

    if (!text.startsWith("/")) return false;

    if (text.startsWith("/set ")) {
        const type = text.split(" ")[1];

        const personality = getPersonality(type);

        setPersonality(sender, personality);

        await sock.sendMessage(sender, {
            text: `Personality di-set ke: ${type} 🎭`
        });

        return true;
    }

    switch (text) {

        case "/reset":
            resetMemory(sender);
            await sock.sendMessage(sender, {
                text: "Memory kamu sudah di-reset 🧠✨"
            });
            return true;

        case "/help":
            await sock.sendMessage(sender, {
                text: `📌 Command List:

/reset → hapus memory
/help → lihat command
/set cs → jadi customer service
/set sales → jadi sales
/set qa → jadi QA assistant
/set santai → ngobrol santai`
            });
            return true;

        case "/set ":
            const type = text.split(" ")[1];
            const personality = getPersonality(type);
            setPersonality(sender, personality);

            await sock.sendMessage(sender, {
                text: `Personality di-set ke: ${type} 🎭`
            });

            return true;

        default:
            await sock.sendMessage(sender, {
                text: "Command tidak dikenali 😅 ketik /help"
            });
            return true;
    }
}

module.exports = handleCommand;