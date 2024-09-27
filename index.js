const express = require("express");
const twilio = require("twilio");
require("dotenv").config();
const axios = require("axios");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const app = express();
const port = process.env.PORT || 3000;

const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/sendMessage", (req, res) => {
  const { person, company, product, to } = req.body;
  const messageBody = `Hi, I'm ${person} from ${company}. You recently checked out ${product}, did you face any issue?`;
  client.messages
    .create({
      body: messageBody,
      from: twilioPhoneNumber,
      to: to,
    })
    .then((message) => res.send(message))
    .catch((error) => {
      console.error(error);
      res.status(500).send("Failed to send message");
    });
});

app.post("/recieveMessage", async (req, res) => {
  const userReply = req.body.Body || req.body.reply;
  const fromNumber = req.body.From || "Manual Testing";

  console.log("User reply:", userReply);
  console.log("From:", fromNumber);

  let followUpMessage = "Thanks for replying, We will get back to you shortly.";

  client.messages
    .create({
      body: followUpMessage,
      from: twilioPhoneNumber,
      to: fromNumber,
    })
    .then(() => res.send("Response sent"))
    .catch((error) => {
      console.error(error);
      res.status(500).send("Failed to send follow-up message");
    });
});

app.post("/recieveMessageStatus", async (req, res) => {
  console.log("Message Status:", req.body.MessageStatus);
  res.send("Message status received");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
