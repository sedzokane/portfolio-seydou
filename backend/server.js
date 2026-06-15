import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import { apiLimiter } from "./middleware/rateLimiters.js";

import authRoutes from "./routes/auth.js";
import projectRoutes from "./routes/projects.js";
import skillRoutes from "./routes/skills.js";
import cvRoutes from "./routes/cv.js";
import messageRoutes from "./routes/messages.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === "production";

const app = express();

// Sécurité HTTP de base (headers)
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // permet de charger les images uploadées depuis le frontend
  })
);

// CORS restreint au frontend configuré
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// Empêche les injections NoSQL via req.body / req.query
app.use(mongoSanitize());

// Limite globale de requêtes
app.use("/api", apiLimiter);

// Fichiers statiques (images de projets, logos de compétences, CV)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes API
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/cv", cvRoutes);
app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API Portfolio opérationnelle" });
});

// 404
app.use("/api", (req, res) => {
  res.status(404).json({ message: "Route introuvable" });
});

// Gestion centralisée des erreurs
app.use((err, req, res, next) => {
  if (!isProd) console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || "Erreur serveur",
    ...(isProd ? {} : { stack: err.stack }),
  });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
});
