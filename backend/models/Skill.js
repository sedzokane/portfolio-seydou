import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ["fullstack", "frontend", "backend", "mobile", "database", "devops", "outil", "autre"],
      default: "autre",
    },
    level: { type: Number, min: 0, max: 100, default: 70 },
    icon: { type: String, default: "" },
    logo: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Skill", skillSchema);