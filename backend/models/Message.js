import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" }, // numéro WhatsApp ou autre
    service: { type: String, default: "" }, // service souhaité
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
