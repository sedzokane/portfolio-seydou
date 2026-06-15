import express from "express";
import cloudinary from "../config/cloudinary.js";
import Skill from "../models/Skill.js";
import { protect } from "../middleware/auth.js";
import { uploadSkillLogo } from "../middleware/upload.js";

const router = express.Router();

// Supprime un logo Cloudinary depuis son URL
const deleteFromCloudinary = async (url) => {
  if (!url) return;
  try {
    const parts = url.split("/");
    const filename = parts[parts.length - 1].split(".")[0];
    const folder = parts[parts.length - 2];
    await cloudinary.uploader.destroy(`${folder}/${filename}`);
  } catch (err) {
    console.error("Erreur suppression Cloudinary :", err.message);
  }
};

// GET /api/skills
router.get("/", async (req, res) => {
  try {
    const skills = await Skill.find().sort({ category: 1, order: 1, name: 1 });
    res.json(skills);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// POST /api/skills
router.post("/", protect, uploadSkillLogo.single("logo"), async (req, res) => {
  try {
    const { name, category, level, icon, order } = req.body;
    const skill = new Skill({
      name,
      category,
      level,
      icon,
      order,
      logo: req.file ? req.file.path : "",
    });
    await skill.save();
    res.status(201).json(skill);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// PUT /api/skills/:id
router.put("/:id", protect, uploadSkillLogo.single("logo"), async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ message: "Compétence introuvable" });

    const { name, category, level, icon, order, removeLogo } = req.body;

    if (name !== undefined)     skill.name     = name;
    if (category !== undefined) skill.category = category;
    if (level !== undefined)    skill.level    = level;
    if (icon !== undefined)     skill.icon     = icon;
    if (order !== undefined)    skill.order    = order;

    if (req.file) {
      await deleteFromCloudinary(skill.logo);
      skill.logo = req.file.path;
    } else if (removeLogo === "true" || removeLogo === true) {
      await deleteFromCloudinary(skill.logo);
      skill.logo = "";
    }

    await skill.save();
    res.json(skill);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// DELETE /api/skills/:id
router.delete("/:id", protect, async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ message: "Compétence introuvable" });

    await deleteFromCloudinary(skill.logo);
    await skill.deleteOne();
    res.json({ message: "Compétence supprimée" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;