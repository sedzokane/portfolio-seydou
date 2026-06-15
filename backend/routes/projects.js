import express from "express";
import cloudinary from "../config/cloudinary.js";
import Project from "../models/Project.js";
import { protect } from "../middleware/auth.js";
import { uploadProjectImage } from "../middleware/upload.js";

const router = express.Router();

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

// GET /api/projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// GET /api/projects/:id
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Projet introuvable" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// POST /api/projects
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
      order:    order || 0,
      image:    req.file ? req.file.path : "",
    });

    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// PUT /api/projects/:id
router.put("/:id", protect, uploadProjectImage.single("image"), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Projet introuvable" });

    const { title, description, technologies, githubUrl, liveUrl, featured, order } = req.body;

    if (title !== undefined)        project.title        = title;
    if (description !== undefined)  project.description  = description;
    if (technologies !== undefined) project.technologies = JSON.parse(technologies);
    if (githubUrl !== undefined)    project.githubUrl    = githubUrl;
    if (liveUrl !== undefined)      project.liveUrl      = liveUrl;
    if (featured !== undefined)     project.featured     = featured === "true" || featured === true;
    if (order !== undefined)        project.order        = order;

    if (req.file) {
      await deleteFromCloudinary(project.image);
      project.image = req.file.path;
    }

    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// DELETE /api/projects/:id
router.delete("/:id", protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Projet introuvable" });

    await deleteFromCloudinary(project.image);
    await project.deleteOne();
    res.json({ message: "Projet supprimé" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;