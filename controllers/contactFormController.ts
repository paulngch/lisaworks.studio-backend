require("dotenv").config();
import express from "express";
const router = express.Router();

import sgMail from "@sendgrid/mail";

//Handling ENV undefined - ts
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
} else {
  throw new Error("process.env.SENDGRID_API_KEY is not set");
}

//For TWILIO SMS when ACRA Registered=======
// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const client = require("twilio")(accountSid, authToken);
//==========================================

import ContactForm from "../models/contactForm";

//===============================
//Uploading (POST) contactForm to mongoDB
router.post("/", async (req, res) => {
  // console.log("req.body", req.body);
  const msg = req.body;
//   console.log(msg.body)
  try {
    //creating form from schema, sending to mongoDB
    const contactForm = await ContactForm.create(req.body);

    //For TWILIO SMS when ACRA Registered=======
    //   //SENDING TWILIO SMS
    //   await client.messages
    //     .create({
    //       body: `CONTACTFORM: ${msg.name}, ${msg.email}, ${msg.feedback}, ${msg.message}`,
    //       from: `${process.env.TWILIO_FROM_NUMBER}`,
    //       to: `${process.env.TWILIO_MY_NUMBER}`,
    //     })
    //     .then((message) => console.log(message.sid));
    //==========================================
    //SENDING TWILIO EMAIL

    const email = {
      to: [`${process.env.SENDGRID_EMAIL1}`, `${process.env.SENDGRID_EMAIL2}`], // recipient
      from: `${process.env.SENDGRID_EMAIL1}`, // verified sender
      subject: `SendGrid: CONTACT FORM from ${msg.name} , ${msg.email}`,
      text: `${msg.name} , ${msg.email} , ${msg.feedback} , ${msg.message}`,
      html: `Email: ${msg.email}
          Name: ${msg.name}
          Feedback Type: ${msg.feedback}
          Message: ${msg.message}`,
    };

    await sgMail.sendMultiple(email).then(() => {
      console.log("Email sent");
    });

    res.status(201).json(contactForm);
  } catch (error) {
    res.status(500).json({ error });
  }
});

//===============================
//Retrieving (GET) ALL contactForm from mongoDB
router.get("/", async (req, res) => {
    // console.log("req.body", req.body);
    // console.log("RES", res);
    // return res.json(res)
    try {
      // creating form from schema, sending to mongoDB
      const contactList = await ContactForm.find().exec();
      res.status(201).json(contactList);
    } catch (error) {
      res.status(500).json({ error });
    }
  });


export default router;
