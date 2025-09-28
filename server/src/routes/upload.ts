import AuthMiddleware, { AuthRequest } from "~/middleware/AuthMiddleware";

import { Router } from "express";
import { Request, Response } from "express";

import multer from "multer";
import path from "path";
import fs, { mkdirpSync, removeSync } from "fs-extra";
import uuid from 'uuid';
import { existsSync } from "fs";

const router: Router = Router();

router.use(AuthMiddleware);

const uploadDir = path.join(".", "uploads");

// Unify this with uploads
const storage = multer.diskStorage({
	destination: uploadDir,
	filename: (req: Request & AuthRequest, _file, cb) => {
		const user: string = req.user!;
		const id = uuid.v4();
		mkdirpSync(`${uploadDir}/${user}/assets/`);
		cb(null, `${user}/assets/${id}`);
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

	const filename = freq.file.filename;
	const fsep = filename.split("/");

	// TODO: here~!!!
	return res
		.status(200)
		.json({
			id: fsep[fsep.length - 1],
			url: freq.file.path,
			message: "File uploaded successfully",
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
	const req2 = req as (Request & AuthRequest);
	const user: string = req2.user!;
	const filePath = path.join(uploadDir, `${user}/assets/${id}`);
	if (existsSync(filePath)) {
		removeSync(filePath);
		return res.status(200).json({ message: "Successfully deleted file." });
	}
	return res.status(404).json({ message: "Not found" });
};

const fileListHandler = async (req: Request, res: Response) => {
	const req2 = req as (Request & AuthRequest);
	const user: string = req2.user!;
	const files = fs.readdirSync(`${uploadDir}/${user}/assets/`);
	return res.json(files.map((f) => { return { id: f, url: `${uploadDir}/${user}/assets/${f}` }; }));
};

// CRUD
router.get('/', fileListHandler);
router.post('/', mu.single('file'), fileSendHandler);
router.get('/:id', fileGetHandler);
router.put('/:id', mu.single('file'), fileUpdateHandler);
router.delete('/:id', fileDeleteHandler);

export default router;
