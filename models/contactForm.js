"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const contactFormSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true, trim: true },
    email: {
        type: String,
        lowercase: true,
        required: [true, "can't be blank"],
    },
    feedback: { type: String, enum: ["Request", "Feedback"] },
    message: { type: String, trim: true },
    active: { type: Boolean, default: true },
    adminComments: { type: String, trim: true, default: "" },
}, { timestamps: true });
const ContactForm = mongoose_1.default.model("ContactForm", contactFormSchema);
exports.default = ContactForm;
//# sourceMappingURL=contactForm.js.map