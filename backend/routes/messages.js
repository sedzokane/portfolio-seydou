import express from "express";
import { body, validationResult } from "express-validator";
import Message from "../models/Message.js";
import { protect } from "../middleware/auth.js";
import { contactLimiter } from "../middleware/rateLimiters.js";
import { sendContactNotification } from "../utils/mailer.js";

const router = express.Router();

// POST /api/messages - envoi d'un message de contact (public)
router.post(
  "/",
  contactLimiter,
  [
    body("fullName").trim().isLength({ min: 2, max: 100 }).withMessage("Nom complet requis (2 à 100 caractères)"),
    body("email").isEmail().withMessage("Email invalide").normalizeEmail(),
    body("phone").optional({ checkFalsy: true }).trim().isLength({ max: 30 }).withMessage("Numéro invalide"),
    body("service").optional({ checkFalsy: true }).trim().isLength({ max: 100 }),
    body("message").trim().isLength({ min: 5, max: 3000 }).withMessage("Message requis (5 à 3000 caractères)"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
      const { fullName, email, phone, service, message } = req.body;
      const newMessage = new Message({ fullName, email, phone, service, message });
      await newMessage.save();

      // Envoie une notification par email (ne bloque pas la réponse si ça échoue)
      sendContactNotification(newMessage);

      res.status(201).json({ message: "Message envoyé avec succès" });
    } catch (err) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  }
);

// GET /api/messages - liste des messages (admin uniquement)
router.get("/", protect, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// PUT /api/messages/:id/read - marquer comme lu (admin uniquement)
router.put("/:id/read", protect, async (req, res) => {
  try {
    const msg = await Message.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    if (!msg) return res.status(404).json({ message: "Message introuvable" });
    res.json(msg);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// DELETE /api/messages/:id - suppression (admin uniquement)
router.delete("/:id", protect, async (req, res) => {
  try {
    const msg = await Message.findByIdAndDelete(req.params.id);
    if (!msg) return res.status(404).json({ message: "Message introuvable" });
    res.json({ message: "Message supprimé" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;
