import express from "express";
import fs from "fs";
import path from "path";
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
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

// GET /api/cv/download - télécharge le CV actif (public)
router.get("/download", async (req, res) => {
  try {
    const cv = await CV.findOne({ active: true }).sort({ createdAt: -1 });
    if (!cv) return res.status(404).json({ message: "Aucun CV disponible" });

    const filePath = path.join(process.cwd(), cv.path);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Fichier introuvable" });
    }

    res.download(filePath, cv.originalName);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

// POST /api/cv - upload d'un nouveau CV (admin uniquement)
// Le nouveau CV devient actif, l'ancien est désactivé (mais conservé)
router.post("/", protect, uploadCV.single("cv"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Fichier CV requis (PDF)" });

    // désactive tous les anciens CV
    await CV.updateMany({}, { active: false });

    const cv = new CV({
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: `/uploads/cv/${req.file.filename}`,
      active: true,
    });

    await cv.save();
    res.status(201).json(cv);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

export default router;
