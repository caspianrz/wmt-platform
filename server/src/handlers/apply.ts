import axios from "axios";
import e, { Request, Response } from "express";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import uuid from "uuid";
import { AuthRequest } from "~/middleware/AuthMiddleware";
import FileModel from "~/models/files";
import ProjectModel from "~/models/projects";
import { strategyData } from "~/strategies/GetStrategy";

export const applyWatermarkHandler = async (req: Request, res: Response) => {
  const strategy = req.params["strategy"];
  const action = req.params["action"];
  const reqStrategyObj = strategyData[strategy!][action!].request;

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

  switch (strategy) {
    case "sharif-wm":
      embedHandlerSharifWm(req, res, strategy, reqStrategyKeys);
      break;
  }
};

const embedHandlerSharifWm = async (
  req: Request,
  res: Response,
  strategy?: string,
  reqStrategyKeys?: string[]
) => {
  try {
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
    for (const key of reqStrategyKeys!) {
      newBody[key] = key === "base" ? imageBase64 : req.body[key];
    }

    const embedUrl = `${strategyData[strategy!]["url"]}/embed`;

    // send to another server as raw bytes
    const response = await axios.post(embedUrl, newBody, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const { image }: { image: string } = response.data; // base64 strings
    const imageBytes = Buffer.from(image, "base64");

    const projectName = uuid.v4();

    const projectPath = path.join(
      ".",
      "uploads",
      userid,
      "projects",
      projectName
    );

    const watermarkedName = `${imageInfo.name}_embed_with_${strategy}.jpg`;

    const newProject = new ProjectModel({
      name: projectName,
      path: projectPath,
      userId: userid,
      originalImage: imageInfo.name,
      stack: [
        {
          name: watermarkedName,
          action: `embed with ${strategy}`,
        },
      ],
    });

    await newProject.save();

    mkdirSync(projectPath, { recursive: true });
    writeFileSync(path.join(projectPath, watermarkedName), imageBytes);

    return res.status(200).send();
  } catch (error) {
    return res.status(500).send();
  }
};

export const extractHandlerSharifWm = async (req: Request, res: Response) => {
  try {
    const strategy = req.params["strategy"];
    const reqStrategyObj = strategyData[strategy!]["extract"].request;

    if (!reqStrategyObj) {
      return res.status(404).json({ message: "Strategy not found" });
    }
    const reqStrategyKeys = Object.keys(reqStrategyObj);

    const { userid } = req as Request & AuthRequest;
    const projectId = req.params["id"];
    const stack = req.body["image"];

    const projectInfo = await ProjectModel.findOne({
      userId: userid,
      _id: projectId,
    });

    if (!projectInfo) {
      return res.status(404).json({ message: "File Not found" });
    }

    const projectPath = projectInfo ? path.resolve(projectInfo.path) : "";
    // find stach that have stack name
    const selectedStack = projectInfo!.stack.find(
      (item) => item.name === stack
    );

    if (!selectedStack) {
      return res.status(404).json({ message: "Stack Not found" });
    }

    const absolutePath = path.resolve(projectPath, selectedStack.name);

    if (!existsSync(absolutePath)) {
      return res.status(404).json({ message: "Image not found" });
    }

    const imageBase64 = readFileSync(absolutePath).toString("base64");

    const newBody: Record<string, string> = {};
    for (const key of reqStrategyKeys!) {
      newBody[key] = key === "image" ? imageBase64 : req.body[key];
    }

    const extractUrl = `${strategyData[strategy!]["url"]}/extract`;

    // send to another server as raw bytes
    const response = await axios.post(extractUrl, newBody, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const watremark: { watermark: string } = response.data; // base64 strings

    return res.status(200).json(watremark);
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
};
