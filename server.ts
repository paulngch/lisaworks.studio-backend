//Using dotenv in app
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";

const app = express();
const PORT = process.env.PORT || 3000;

//IMPORT
import contactFormController from "./controllers/contactFormController";

//MIDDLEWARES=============
//Cors
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "x-access-token"],
  })
);
app.use(express.json());
app.use(morgan("dev"));

//controllers
app.use("/api/contactform", contactFormController);
//========================

//MONGO
//handling ENV undefined - typescript
let mongoURI = process.env.SECRET_KEY;
if (process.env.SECRET_KEY) {
  mongoURI = process.env.SECRET_KEY;
} else {
  throw new Error("process.env.SECRET_KEY is not set");
}

const db = mongoose.connection;
//global setting
mongoose.set("runValidators", true);
mongoose.set("strictQuery", false);
mongoose.set("debug", true);
mongoose.connect(mongoURI);

// Connection Error/Success
db.on("error", (err) => console.log(err.message + " is mongod not running?"));
db.on("connected", () => console.log("mongo connected: ", mongoURI));
db.on("disconnected", () => console.log("mongo disconnected"));

//Listener
db.once("open", () => {
  console.log("connected to mongo", mongoURI);
  app.listen(PORT, () => {
    console.log("listening on port", PORT);
  });
});

//Server status msg
app.get("/", (req, res) => {
  res.json({ ServerStatus: "Running" });
});
