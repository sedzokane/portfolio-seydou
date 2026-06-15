import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import Admin from "../models/Admin.js";
import { loginLimiter } from "../middleware/rateLimiters.js";

const router = express.Router();

// POST /api/auth/login
router.post(
  "/login",
  loginLimiter,
  [
    body("email").isEmail().withMessage("Email invalide").normalizeEmail(),
    body("password").isString().isLength({ min: 1 }).withMessage("Mot de passe requis"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
      const { email, password } = req.body;

      const admin = await Admin.findOne({ email });
      if (!admin) {
        return res.status(401).json({ message: "Identifiants invalides" });
      }

      const match = await bcrypt.compare(password, admin.password);
      if (!match) {
        return res.status(401).json({ message: "Identifiants invalides" });
      }

      const token = jwt.sign(
        { id: admin._id, email: admin.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.json({
        token,
        admin: { id: admin._id, email: admin.email, name: admin.name },
      });
    } catch (err) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  }
);

// GET /api/auth/me - vérifie le token et renvoie les infos admin
router.get("/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Non autorisé" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select("-password");

    if (!admin) return res.status(404).json({ message: "Admin introuvable" });
    res.json(admin);
  } catch (err) {
    res.status(401).json({ message: "Token invalide" });
  }
});

export default router;
