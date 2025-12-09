import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import axios from "axios";

dotenv.config();

const app: Application = express();
const corsOptions = {
  exposedHeaders: ["Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
  allowedHeaders: ["Authorization", "Content-Type"], // Allowed headers
};

// Register middle-wares.
app.use(cors(corsOptions));
app.use(express.json());

app.get("/", async (_, res) => {
  try {
    // path to your local image
    const imagePath = "./tests/assets/image.jpg";
    const wmPath = "./tests/assets/watermark.jpg";

    // read file into buffer
    const imbuffer = fs.readFileSync(imagePath).toString("base64");
    const wmbuffer = fs.readFileSync(wmPath).toString("base64");

    const body = {
      base: imbuffer,
      watermark: wmbuffer,
    };

    // send to another server as raw bytes
    const response = await axios.post("http://localhost:10000/embed", body, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const { image, data }: { image: string; data: string } = response.data; // base64 strings
    const imageBytes = Buffer.from(image, "base64");
    const dataBytes = Buffer.from(data, "base64");
    // decode + save
    const imgAPath = "./img.jpg";
    const imgBPath = "./data";
    fs.writeFileSync(imgAPath, imageBytes as Uint8Array);
    fs.writeFileSync(imgBPath, dataBytes as Uint8Array);
    res.json({ ok: true, result: response.data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Invalid microservice job." });
  }
});

const port = process.env.PORT || 9990;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
