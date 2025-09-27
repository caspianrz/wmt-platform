import { Router, Request, Response } from "express";

import path from "path";

import multer from "multer";
import uuid from "uuid";
import AuthMiddleware, { AuthRequest } from "~/middleware/AuthMiddleware";
import DatabaseManager from "~/managers/DatabaseManager";
import FileRequest from "~/models/FileRequest";
import { mkdirpSync, remove, removeSync } from "fs-extra";

const router: Router = Router();
router.use(AuthMiddleware);

const uploadDir = path.join(".", "uploads");

const storage = multer.diskStorage({
	destination: uploadDir,
	filename: (req: Request & AuthRequest, _file, cb) => {
		const user: string = req.user!;
		const id = uuid.v4();
		mkdirpSync(`${uploadDir}/${user}/watermark/`);
		cb(null, `${user}/watermark/${id}`);
	},
});

const mu = multer({ storage: storage });

const watermarkGetHandler = async (req: Request, res: Response) => {
	const authReq = req as Request & AuthRequest;
	if (authReq.user! == undefined) {
		return res.sendStatus(401);
	}
	const data = await DatabaseManager.instance.getUserWatermarks(authReq.user);
	res.json(data);
}

const watermarkCreateHandler = async (req: Request, res: Response) => {
	const authReq = req as Request & AuthRequest;
	const fileReq = req as FileRequest;
	if (authReq.user == undefined) {
		return res.sendStatus(400);
	}
	const id = await DatabaseManager.instance.addWatermark(authReq.user, fileReq.file.path);
	res.json({ id: id });
}

const watermarkDeleteHandler = async (req: Request, res: Response) => {
	const authReq = req as Request & AuthRequest;
	if (authReq.user == undefined) {
		return res.sendStatus(400);
	}
	const doc = await DatabaseManager.instance.deleteWatermark(req.body.id);
	removeSync(`${uploadDir}/${authReq.user}/watermark/${req.body.id}`);
	res.json({ doc: doc });

}

router.get('/', watermarkGetHandler);
router.post('/', mu.single('file'), watermarkCreateHandler);
router.delete('/', watermarkDeleteHandler);

export default router;
