import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { connectDB } from "./config/db.js";
import Admin from "./models/Admin.js";
import mongoose from "mongoose";

dotenv.config();

const run = async () => {
  await connectDB();

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  const existing = await Admin.findOne({ email });
  if (existing) {
    await Admin.deleteOne({ email });
    console.log("Ancien compte admin supprimé.");
  }

  const hashed = await bcrypt.hash(password, 10);
  const admin = new Admin({ email, password: hashed, name: "Admin" });
  await admin.save();

  console.log(`Compte admin créé : ${email}`);
  mongoose.connection.close();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});