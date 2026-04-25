const {
  default: makeWASocket,
  useMultiFileAuthState
} = require("@whiskeysockets/baileys")

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("./session")

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true
  })

  sock.ev.on("creds.update", saveCreds)

  // =====================
  // CONNECTION
  // =====================
  sock.ev.on("connection.update", (u) => {
    const { connection } = u
    console.log("STATUS:", connection)

    if (connection === "open") {
      console.log("🤖 BOT ONLINE")
    }
  })

  // =====================
  // MESSAGE HANDLER
  // =====================
  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0]
    if (!msg.message) return

    const from = msg.key.remoteJid

    const text =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text ||
      msg.message.buttonsResponseMessage?.selectedButtonId

    // =====================
    // MENU BUTTON
    // =====================
    if (text === "menu" || text === "MENU") {
      return await sock.sendMessage(from, {
        text: "📌 *AMIL JAYA FOTOCOPY*",
        buttons: [
          { buttonId: "harga", buttonText: { displayText: "💰 Harga" }, type: 1 },
          { buttonId: "order", buttonText: { displayText: "🛒 Order" }, type: 1 },
          { buttonId: "help", buttonText: { displayText: "ℹ️ Bantuan" }, type: 1 }
        ],
        headerType: 1
      })
    }

    // =====================
    // HARGA
    // =====================
    if (text === "harga") {
      return await sock.sendMessage(from, {
        text:
          "💰 *HARGA FOTOCOPY*\n\n" +
          "- BW: Rp500\n" +
          "- Color: Rp1000"
      })
    }

    // =====================
    // ORDER
    // =====================
    if (text === "order") {
      return await sock.sendMessage(from, {
        text: "📦 Kirim file / foto untuk dicetak"
      })
    }

    // =====================
    // HELP
    // =====================
    if (text === "help") {
      return await sock.sendMessage(from, {
        text: "Ketik 'menu' untuk mulai"
      })
    }
  })
}

startBot()
