import { Request, Response } from "express";
import fs, { mkdirpSync, removeSync } from "fs-extra";
import multer from "multer";
import path from "path";
import uuid from "uuid";
import { AuthRequest } from "~/middleware/AuthMiddleware";

const uploadDir = path.join(".", "uploads");

interface FileRequest extends Request {
  file: Express.Multer.File;
}

export const fileSendHandler = async (req: Request, res: Response) => {
  const freq = req as FileRequest;

  if (!freq.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  const filename = freq.file.filename;
  const fsep = filename.split("/");

  return res.status(200).json({
    id: fsep[fsep.length - 1],
    url: freq.file.path,
    message: "File uploaded successfully",
  });
};

export const fileListHandler = async (req: Request, res: Response) => {
  const req2 = req as Request & AuthRequest;
  const user: string = req2.user!;
  const files = fs.readdirSync(`${uploadDir}/${user}/assets/`);
  return res.json(
    files.map((f) => {
      return { id: f, url: `${uploadDir}/${user}/assets/${f}` };
    })
  );
};

export const fileGetHandler = async (req: Request, res: Response) => {
  const id = req.params["id"] || uuid.NIL;
  const filePath = path.join(uploadDir, id);
  if (fs.existsSync(filePath)) {
    return res.status(200).sendFile(id, {
      root: uploadDir,
    });
  }
  return res.status(404).json({ message: "Not found" });
};

export const fileUpdateHandler = async (req: Request, res: Response) => {
  const file = req.file as Express.Multer.File;

  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const oldFilePath = path.join("uploads", "old-avatar.png");

  if (fs.existsSync(oldFilePath)) {
    fs.unlinkSync(oldFilePath); // delete old file
  }

  // save new file path to DB here
  res.json({
    message: "File updated successfully",
    file,
  });
};

export const fileDeleteHandler = async (req: Request, res: Response) => {
  const id = req.params["id"] || uuid.NIL;
  const req2 = req as Request & AuthRequest;
  const user: string = req2.user!;
  const filePath = path.join(uploadDir, `${user}/assets/${id}`);
  if (fs.existsSync(filePath)) {
    removeSync(filePath);
    return res.status(200).json({ message: "Successfully deleted file." });
  }
  return res.status(404).json({ message: "Not found" });
};
