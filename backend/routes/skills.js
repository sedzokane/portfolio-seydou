import express from "express";
import fs from "fs";
import path from "path";
import Skill from "../models/Skill.js";
import { protect } from "../middleware/auth.js";
import { uploadSkillLogo } from "../middleware/upload.js";

const router = express.Router();

// GET /api/skills - liste publique
router.get("/", async (req, res) => {
  try {
    const skills = await Skill.find().sort({ category: 1, order: 1, name: 1 });
    res.json(skills);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

// POST /api/skills - création (admin uniquement)
router.post("/", protect, uploadSkillLogo.single("logo"), async (req, res) => {
  try {
    const { name, category, level, icon, order } = req.body;
    const skill = new Skill({
      name,
      category,
      level,
      icon,
      order,
      logo: req.file ? `/uploads/skills/${req.file.filename}` : "",
    });
    await skill.save();
    res.status(201).json(skill);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

// PUT /api/skills/:id - modification (admin uniquement)
router.put("/:id", protect, uploadSkillLogo.single("logo"), async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ message: "Compétence introuvable" });

    const { name, category, level, icon, order, removeLogo } = req.body;

    if (name !== undefined) skill.name = name;
    if (category !== undefined) skill.category = category;
    if (level !== undefined) skill.level = level;
    if (icon !== undefined) skill.icon = icon;
    if (order !== undefined) skill.order = order;

    const deleteOldLogo = () => {
      if (skill.logo) {
        const oldPath = path.join(process.cwd(), skill.logo);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
    };

    if (req.file) {
      deleteOldLogo();
      skill.logo = `/uploads/skills/${req.file.filename}`;
    } else if (removeLogo === "true" || removeLogo === true) {
      deleteOldLogo();
      skill.logo = "";
    }

    await skill.save();
    res.json(skill);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

// DELETE /api/skills/:id - suppression (admin uniquement)
router.delete("/:id", protect, async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ message: "Compétence introuvable" });

    if (skill.logo) {
      const logoPath = path.join(process.cwd(), skill.logo);
      if (fs.existsSync(logoPath)) fs.unlinkSync(logoPath);
    }

    await skill.deleteOne();
    res.json({ message: "Compétence supprimée" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

export default router;
