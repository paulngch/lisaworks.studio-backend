"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//Using dotenv in app
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const mongoose_1 = __importDefault(require("mongoose"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
//IMPORT
const contactFormController_1 = __importDefault(require("./controllers/contactFormController"));
//MIDDLEWARES=============
//Cors
app.use((0, cors_1.default)({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "x-access-token"],
}));
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
//controllers
app.use("/api/contactform", contactFormController_1.default);
//========================
//MONGO
//handling ENV undefined - typescript
let mongoURI = process.env.SECRET_KEY;
if (process.env.SECRET_KEY) {
    mongoURI = process.env.SECRET_KEY;
}
else {
    throw new Error("process.env.SECRET_KEY is not set");
}
const db = mongoose_1.default.connection;
//global setting
mongoose_1.default.set("runValidators", true);
mongoose_1.default.set("strictQuery", false);
mongoose_1.default.set("debug", true);
mongoose_1.default.connect(mongoURI);
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
//# sourceMappingURL=server.js.map