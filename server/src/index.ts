import bodyParser from "body-parser";
import express from "express";
import { Application, Request, Response, Router } from "express";
import cors from 'cors';
import multer from 'multer';
import { spawn } from "child_process";
import { existsSync, mkdirSync, rmSync } from "fs";
import { ApplyAttack } from "./attacks/attack";

rmSync('uploads', {
	force: true,
	recursive: true,
})

rmSync('wmarked', {
	force: true,
	recursive: true,
});

mkdirSync('uploads');
mkdirSync('wmarked');

const upload = multer({ dest: "uploads/" })

const app: Application = express();
const port = process.env.PORT || 9990;
const api: Router = Router();

app.use(cors());
app.use(express.json());
app.use('/wmarked', express.static('./wmarked'));
app.use(bodyParser.urlencoded({ extended: true }));

interface ImageFields {
	image?: Express.Multer.File[];
	watermark?: Express.Multer.File[];
	alpha?: number,
}

type ImageFieldRequest = Request & { files: ImageFields };

api.post('/watermark', upload.fields([{ name: "image" }, { name: "watermark" }]), (req: ImageFieldRequest, res: any) => {
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

api.get('/watermark', (req: Request, res: Response) => {
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

api.post('/attack', async (req: Request, res: Response) => {
	const attackName: string = req.body.name;
	const attackArgs: string[] = req.body.args;
	attackArgs[0] = `uploads/${attackArgs[0]}`;

	const result = await ApplyAttack({
		name: attackName,
		args: attackArgs,
	});

	if (result) {
		res.send('OK');
	} else {
		res.send('NOK');
	}
});

app.use('/api', api);

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
