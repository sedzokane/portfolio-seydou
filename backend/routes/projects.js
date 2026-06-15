import express from "express";
import fs from "fs";
import path from "path";
import Project from "../models/Project.js";
import { protect } from "../middleware/auth.js";
import { uploadProjectImage } from "../middleware/upload.js";

const router = express.Router();

// GET /api/projects - liste publique
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

// GET /api/projects/:id
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Projet introuvable" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

// POST /api/projects - création (admin uniquement)
router.post("/", protect, uploadProjectImage.single("image"), async (req, res) => {
  try {
    const { title, description, technologies, githubUrl, liveUrl, featured, order } = req.body;

    const project = new Project({
      title,
      description,
      technologies: technologies ? JSON.parse(technologies) : [],
      githubUrl,
      liveUrl,
      featured: featured === "true" || featured === true,
      order: order || 0,
      image: req.file ? `/uploads/projects/${req.file.filename}` : "",
    });

    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

// PUT /api/projects/:id - modification (admin uniquement)
router.put("/:id", protect, uploadProjectImage.single("image"), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Projet introuvable" });

    const { title, description, technologies, githubUrl, liveUrl, featured, order } = req.body;

    if (title !== undefined) project.title = title;
    if (description !== undefined) project.description = description;
    if (technologies !== undefined) project.technologies = JSON.parse(technologies);
    if (githubUrl !== undefined) project.githubUrl = githubUrl;
    if (liveUrl !== undefined) project.liveUrl = liveUrl;
    if (featured !== undefined) project.featured = featured === "true" || featured === true;
    if (order !== undefined) project.order = order;

    if (req.file) {
      // supprime l'ancienne image si elle existe
      if (project.image) {
        const oldPath = path.join(process.cwd(), project.image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      project.image = `/uploads/projects/${req.file.filename}`;
    }

    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

// DELETE /api/projects/:id - suppression (admin uniquement)
router.delete("/:id", protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Projet introuvable" });

    if (project.image) {
      const imgPath = path.join(process.cwd(), project.image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    await project.deleteOne();
    res.json({ message: "Projet supprimé" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

export default router;
