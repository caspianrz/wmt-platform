import axios from "axios";
import { Request, Response } from "express";
import { existsSync, readFileSync } from "fs";
import { AuthRequest } from "~/middleware/AuthMiddleware";
import FileModel from "~/models/files";
import { strategyData } from "~/strategies/GetStrategy";

export const applyWatermarkHandler = async (req: Request, res: Response) => {
  try {
    const strategy = req.params["strategy"];
    const reqStrategyObj = strategyData[strategy!].embed.request;

    if (!reqStrategyObj) {
      return res.status(404).json({ message: "Strategy not found" });
    }

    const reqStrategyKeys = Object.keys(reqStrategyObj);
    const bodyKeys = Object.keys(req.body);

    // Check for exact key match
    const allKeysMatch = reqStrategyKeys.every((key) => bodyKeys.includes(key));

    // chech for length
    const lengthMatch = reqStrategyKeys.length !== bodyKeys.length;

    if (!allKeysMatch || lengthMatch) {
      return res.status(400).json({ message: "Bad Arguments" });
    }

    const { userid } = req as Request & AuthRequest;

    const imageInfo = await FileModel.findOne({
      name: req.body.base,
      userId: userid,
    });

    if (!imageInfo || !existsSync(imageInfo.path)) {
      return res.status(404).json({ message: "Image not found" });
    }

    const imageBase64 = readFileSync(imageInfo.path).toString("base64");

    const newBody: Record<string, string> = {};
    for (const key of reqStrategyKeys) {
      newBody[key] = key === "base" ? imageBase64 : req.body[key];
    }

    console.log(newBody);

    const embedUrl = `${strategyData[strategy!]["url"]}/embed`;

    // send to another server as raw bytes
    // const response = await axios.post(embedUrl, newBody, {
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });

    // const { image, data }: { image: string; data: string } = response.data; // base64 strings
    // const imageBytes = Buffer.from(image, "base64");
    // const dataBytes = Buffer.from(data, "base64");

    return res.status(200).json({
      image: imageBase64,
      watermark: req.body.watermark,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
