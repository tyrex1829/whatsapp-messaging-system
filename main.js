const { Client, LocalAuth } = require("whatsapp-web.js");

const qrCode = require("qrcode-terminal");

// Create a new client instance
const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: "local_auth",
  }),
});

// When the client is ready, This code will run only once.
client.once("ready", () => {
  console.log("Client is ready!");
});

// When the client received QR-Code
client.on("qr", (qr) => {
  qrCode.generate(qr, { small: true });
});

// Listening to all incoming messages
client.on("message_create", (message) => {
  console.log(message.body);
});

client.on("message_create", (message) => {
  if (message.body === "!ping") {
    // send back "pong" to the chat the message was sent in
    client.sendMessage(message.from, "pong");
  }
});

// Start your client
client.initialize();
