import { Request, Response } from "express";
import { existsSync } from "fs";
import { removeSync } from "fs-extra";
import path from "path";
import { AuthRequest } from "~/middleware/AuthMiddleware";
import ProjectModel from "~/models/projects";

export const projectListHandler = async (req: Request, res: Response) => {
  try {
    const { userid } = req as Request & AuthRequest;

    const projects = await ProjectModel.find({ userId: userid }, { _id: 1 });

    return res.status(200).json(projects);
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const getProjectHandler = async (req: Request, res: Response) => {
  try {
    const { userid } = req as Request & AuthRequest;
    const projectId = req.params["id"];

    const project = await ProjectModel.findOne({
      userId: userid,
      _id: projectId,
    });

    return res.status(200).json(project);
  } catch (error) {
    return res.status(500).send();
  }
};

export const getProjectFileHandler = async (req: Request, res: Response) => {
  try {
    const { userid } = req as Request & AuthRequest;
    const projectId = req.params["id"];
    const stack = req.params["stack"];

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
      return res.status(404).json({ message: "File Not found" });
    }

    return res.status(200).sendFile(absolutePath);
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const deleteProjectHandler = async (req: Request, res: Response) => {
  try {
    const { userid } = req as Request & AuthRequest;
    const projectId = req.params["id"];

    const projectInfo = await ProjectModel.findOne({
      userId: userid,
      _id: projectId,
    });

    if (!projectInfo || !existsSync(projectInfo.path)) {
      return res.status(404).json({ message: "File Not found" });
    }

    await ProjectModel.deleteOne({ userId: userid, _id: projectId });

    removeSync(projectInfo.path);
    return res.status(200).json({ message: "Successfully deleted file." });
  } catch (error) {
    return res.status(500).send();
  }
};
