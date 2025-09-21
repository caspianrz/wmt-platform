import { Router, Request, Response } from "express";
import multer from "multer";
import { spawn } from "child_process";
import { existsSync } from "fs";

const router : Router = Router();

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


const upload = multer({ dest: "uploads/" })

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

export default router;
