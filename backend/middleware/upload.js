import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Stockage images de projets
const projectStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:         "portfolio/projects",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 1200, height: 800, crop: "limit" }],
  },
});

// Stockage logos de compétences
const skillStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:         "portfolio/skills",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "svg"],
  },
});

// Stockage CV — Cloudinary ne gère pas les PDF en upload direct
// On garde multer mémoire pour le CV et on upload manuellement
import { CloudinaryStorage as CS } from "multer-storage-cloudinary";

const cvStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:         "portfolio/cv",
    allowed_formats: ["pdf"],
    resource_type:  "raw",
  },
});

export const uploadProjectImage = multer({
  storage: projectStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadSkillLogo = multer({
  storage: skillStorage,
  limits: { fileSize: 2 * 1024 * 1024 },
});

export const uploadCV = multer({
  storage: cvStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
});