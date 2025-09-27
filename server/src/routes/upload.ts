import AuthMiddleware, { AuthRequest } from "~/middleware/AuthMiddleware";

import { Router } from "express";
import { Request, Response } from "express";

import multer from "multer";
import path from "path";
import fs from "fs-extra";
import uuid from 'uuid';
import { existsSync } from "fs";

const router: Router = Router();

router.use(AuthMiddleware);

const uploadDir = path.join(".", "uploads");

const storage = multer.diskStorage({
	destination: uploadDir,
	filename: (req: Request & AuthRequest, _file, cb) => {
		const user: string = req.user!;
		const id = uuid.v4();
		cb(null, `${user}/${id}`);
	},
});

const mu = multer({ storage: storage });

interface FileRequest extends Request {
	file: Express.Multer.File;
};

const fileSendHandler = async (req: Request, res: Response) => {
	const freq = req as FileRequest;

	if (!freq.file) {
		return res
			.status(400)
			.json({ error: "No file uploaded." });
	}

	return res
		.status(200)
		.json({
			id: freq.file.filename,
			message: "File uploaded successfully",
			path: freq.file.path,
		});
};

const fileUpdateHandler = async (req: Request, res: Response) => {
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

const fileGetHandler = async (req: Request, res: Response) => {
	const id = req.params['id'] || uuid.NIL;
	const filePath = path.join(uploadDir, id);
	if (existsSync(filePath)) {
		return res.status(200).sendFile(id, {
			root: uploadDir
		});
	}
	return res.status(404).json({ message: "Not found" });
};

const fileDeleteHandler = async (req: Request, res: Response) => {
	const id = req.params['id'] || uuid.NIL;
	const filePath = path.join(uploadDir, id);
	if (existsSync(filePath))
		return res.status(200).json({ message: "Successfully deleted file." });
	return res.status(404).json({ message: "Not found" });
};

const fileListHandler = async (req: Request, res: Response) => {

};

// CRUD
router.get('/', fileListHandler);
router.post('/', mu.single('file'), fileSendHandler);
router.get('/:id', fileGetHandler);
router.put('/:id', mu.single('file'), fileUpdateHandler);
router.delete('/:id', fileDeleteHandler);

export default router;
