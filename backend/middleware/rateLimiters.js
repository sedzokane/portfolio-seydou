import rateLimit from "express-rate-limit";

// Limite stricte sur la connexion admin (anti brute-force)
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { message: "Trop de tentatives de connexion. Réessayez plus tard." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limite sur le formulaire de contact (anti-spam)
export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 5,
  message: { message: "Trop de messages envoyés. Réessayez dans une heure." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limite générale sur toute l'API
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
