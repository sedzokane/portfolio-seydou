import express from "express";
import cloudinary from "../config/cloudinary.js";
import CV from "../models/CV.js";
import { protect } from "../middleware/auth.js";
import { uploadCV } from "../middleware/upload.js";

const router = express.Router();

// GET /api/cv - récupère le CV actif (public)
router.get("/", async (req, res) => {
  try {
    const cv = await CV.findOne({ active: true }).sort({ createdAt: -1 });
    if (!cv) return res.status(404).json({ message: "Aucun CV disponible" });
    res.json(cv);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// GET /api/cv/download - redirige vers l'URL Cloudinary du CV actif
router.get("/download", async (req, res) => {
  try {
    const cv = await CV.findOne({ active: true }).sort({ createdAt: -1 });
    if (!cv) return res.status(404).json({ message: "Aucun CV disponible" });
    res.redirect(cv.path);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// POST /api/cv - upload d'un nouveau CV (admin uniquement)
router.post("/", protect, uploadCV.single("cv"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Fichier CV requis (PDF)" });

    // Désactive tous les anciens CV
    await CV.updateMany({}, { active: false });

    const cv = new CV({
      filename:     req.file.filename,
      originalName: req.file.originalname,
      path:         req.file.path,
      active:       true,
    });

    await cv.save();
    res.status(201).json(cv);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;