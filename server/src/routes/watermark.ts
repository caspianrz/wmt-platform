import { Router, Request, Response } from "express";

import path from "path";

import multer from "multer";
import uuid from "uuid";
import AuthMiddleware, { AuthRequest } from "~/middleware/AuthMiddleware";
import DatabaseManager from "~/managers/DatabaseManager";
import FileRequest from "~/models/FileRequest";

const router: Router = Router();
router.use(AuthMiddleware);

const uploadDir = path.join(".", "uploads");

const storage = multer.diskStorage({
	destination: uploadDir,
	filename: (req: Request & AuthRequest, _file, cb) => {
		const user: string = req.user!;
		const id = uuid.v4();
		cb(null, `${user}/watermark/${id}`);
	},
});

const mu = multer({ storage: storage });

const watermarkCreateHandler = async (req: Request, res: Response) => {
	const authReq = req as Request & AuthRequest;
	const fileReq = req as FileRequest;
	if (authReq.user == undefined) {
		return res.sendStatus(400);
	}
	const id = await DatabaseManager.instance.addWatermark(authReq.user, fileReq.file.path);
	res.json({ id: id });
}

router.get('/', () => { });
router.post('/', mu.single('file'), watermarkCreateHandler);

/*

interface ImageFields {
	image?: Express.Multer.File[];
	watermark?: Express.Multer.File[];
	alpha?: number,
}

type ImageFieldRequest = Request & { files: ImageFields };

router.get('/watermark', (req: Request, res: Response) => {
	const imageFile = `wmarked/${req.query.id}.png`;
	const binFile = `wmarked/${req.query.id}.bin`;
	const exwmark = `wmarked/ex-${req.query.id}.png`;
	if (existsSync(imageFile) && existsSync(binFile)) {
		const proc = spawn("bin/diunwatermark", [
			imageFile,
			binFile,
			exwmark,
		]);

		proc.on('error', (err) => {
			res
				.status(404)
				.json({
					message: err.message
				});
		});

		proc.on('exit', () => {
			res.json({
				'url': exwmark
			});
		});
	}
});

router.post('/watermark', upload.fields([{ name: "image" }, { name: "watermark" }]), (req: ImageFieldRequest, res: any) => {
	const imageFile = req.files.image?.[0];
	const watermarkFile = req.files.watermark?.[0];
	const watermarkAlpha = req.body.alpha;
	const proc = spawn("bin/diwatermark", [
		`uploads/${imageFile?.filename}`,
		`uploads/${watermarkFile?.filename}`,
		`wmarked/${imageFile?.filename}.png`,
		`wmarked/${imageFile?.filename}.bin`,
		`${watermarkAlpha}`
	]);
	proc.on("error", (err) => {
		res.json({
			'status': -1,
			'message': err.message,
		});
	});

	proc.on("exit", () => {
		res.json({
			'id': `${imageFile?.filename}`,
			'url': `wmarked/${imageFile?.filename}.png`,
			'status': 1,
		});
	});
});
*/

export default router;
