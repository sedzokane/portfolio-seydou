import nodemailer from "nodemailer";

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null; // email non configuré
  }
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  return transporter;
};

// Échappe les caractères HTML pour éviter toute injection dans l'email
const escapeHtml = (str = "") =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

// Envoie une notification email lorsqu'un nouveau message de contact arrive
export const sendContactNotification = async (msg) => {
  const t = getTransporter();
  if (!t) {
    console.log("Email non configuré — notification non envoyée (voir .env).");
    return;
  }

  const to = process.env.NOTIFY_EMAIL || process.env.SMTP_USER;

  const html = `
    <h2>Nouveau message depuis le portfolio</h2>
    <p><strong>Nom complet :</strong> ${escapeHtml(msg.fullName)}</p>
    <p><strong>Email :</strong> ${escapeHtml(msg.email)}</p>
    <p><strong>Téléphone / WhatsApp :</strong> ${escapeHtml(msg.phone) || "Non renseigné"}</p>
    <p><strong>Service souhaité :</strong> ${escapeHtml(msg.service) || "Non précisé"}</p>
    <p><strong>Message :</strong></p>
    <p>${escapeHtml(msg.message).replace(/\n/g, "<br>")}</p>
    <hr>
    <p style="color:#888;font-size:12px;">Reçu le ${new Date().toLocaleString("fr-FR")}</p>
  `;

  try {
    await t.sendMail({
      from: `"Portfolio" <${process.env.SMTP_USER}>`,
      to,
      replyTo: msg.email,
      subject: `Nouveau contact portfolio — ${msg.fullName}`,
      html,
    });
  } catch (err) {
    console.error("Erreur lors de l'envoi de l'email :", err.message);
  }
};
