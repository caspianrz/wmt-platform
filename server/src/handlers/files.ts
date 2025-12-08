import { Request, Response } from "express";
import fs, { removeSync } from "fs-extra";
import path from "path";
import uuid from "uuid";
import { AuthRequest } from "~/middleware/AuthMiddleware";
import FileModel from "~/models/files";

interface FileRequest extends Request {
  file: Express.Multer.File;
}

export const fileSendHandler = async (req: Request, res: Response) => {
  const freq = req as FileRequest;
  const req2 = req as Request & AuthRequest;

  if (!freq.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  const filename = freq.file.filename;
  const fsep = filename.split("/");
  const name = fsep[fsep.length - 1]?.split(".")[0];

  const newFile = new FileModel({
    name,
    path: freq.file.path,
    type: freq.file.mimetype,
    userId: req2.userid, // !!
  });

  await newFile.save();

  return res.status(200).json({
    id: fsep[fsep.length - 1]?.split(".")[0],
    url: freq.file.path,
    message: "File uploaded successfully",
  });
};

export const fileListHandler = async (req: Request, res: Response) => {
  const req2 = req as Request & AuthRequest;
  const userId: string = req2.userid;

  const files = await FileModel.find({ userId }, { _id: 0, __v: 0 });

  return res.status(200).json(files);
};

export const fileGetHandler = async (req: Request, res: Response) => {
  const req2 = req as Request & AuthRequest;

  const id = req.params["id"] || uuid.NIL;

  const fileInfo = await FileModel.findOne(
    { name: id, userId: req2.userid },
    { _id: 0, __v: 0 }
  );

  const absolutePath = fileInfo ? path.resolve(fileInfo.path) : "";

  if (!fileInfo || !fs.existsSync(absolutePath)) {
    return res.status(404).json({ message: "File Not found" });
  }

  return res.status(200).sendFile(absolutePath);
};

export const fileUpdateHandler = async (req: Request, res: Response) => {
  const file = req.file as Express.Multer.File;
  const req2 = req as Request & AuthRequest;

  try {
    const id = req.params["id"] || uuid.NIL;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileInfo = await FileModel.findOne({ name: id, userId: req2.userid });

    if (!fileInfo) {
      fs.unlinkSync(file.path);
      return res.status(404).json({ message: "File Not found" });
    }

    const absolutePath = path.resolve(fileInfo.path);

    if (!fs.existsSync(absolutePath)) {
      fs.unlinkSync(file.path);
      return res.status(404).json({ message: "File Not found" });
    }

    // safe way to extract name without extension
    const newName = path.parse(file.filename).name;

    fileInfo.set({
      path: file.path,
      type: file.mimetype,
      name: newName,
    });
    await fileInfo.save();

    // delete old file
    fs.unlinkSync(absolutePath);

    return res.status(200).json({
      message: "File updated successfully",
      url: file.path,
    });
  } catch (err) {
    fs.unlinkSync(file.path);
    return res.status(500).json({ message: "Failed to update file" });
  }
};

export const fileDeleteHandler = async (req: Request, res: Response) => {
  const id = req.params["id"] || uuid.NIL;
  const req2 = req as Request & AuthRequest;
  const userId: string = req2.userid;

  const fileInfo = await FileModel.findOne({ name: id, userId });

  if (!fileInfo || !fs.existsSync(fileInfo.path)) {
    return res.status(404).json({ message: "File Not found" });
  }

  await FileModel.deleteOne({ name: id, userId });

  removeSync(fileInfo.path);
  return res.status(200).json({ message: "Successfully deleted file." });
};
