import mongoose from "mongoose";
import dotenv from "dotenv";
import WasteGuide from "../models/WasteGuide.js";
import fs from "fs";

dotenv.config();

const seedWasteGuides = async () => {
  try {
    const data = JSON.parse(
      fs.readFileSync("./data/wasteGuides.json", "utf-8")
    );

    if (!Array.isArray(data)) throw new Error("JSON is not an array!");

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
    await WasteGuide.deleteMany(); // Clear existing

    console.log("🟡 Seeding WasteGuide...");
    const inserted = await WasteGuide.insertMany(data);
    console.log(`Inserted ${inserted.length} waste guides.`);
    console.log("✅ Done inserting waste guides");

    process.exit();
  } catch (err) {
    console.error("Error seeding waste guides:", err.stack);
    process.exit(1);
  }
};

seedWasteGuides();
