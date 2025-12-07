import cors from "cors";
import dotenv from "dotenv";
import express, { Application } from "express";
import mongoose from "mongoose";

dotenv.config();

import API from "@routes/api";
import { fetchStrategyData } from "./strategies/GetStrategy";

const app: Application = express();
const corsOptions = {
  exposedHeaders: ["Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
  allowedHeaders: ["Authorization", "Content-Type"], // Allowed headers
};

// Register middle-wares.
app.use(cors(corsOptions));
app.use(express.json());
app.use("/api", API);

const port = process.env.PORT || 10000;
console.log(process.env.DATABASE_URL);

mongoose.set("strictQuery", false);

mongoose
  .connect(process.env.DATABASE_URL!, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });

fetchStrategyData();
