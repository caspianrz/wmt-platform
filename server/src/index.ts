import bodyParser from "body-parser";
import express from "express";
import { Application, Request, Response, Router } from "express";
import cors from 'cors';
import multer from 'multer';
import { spawn, spawnSync } from "child_process";

const upload = multer({ dest: "uploads/" })

const app: Application = express();
const port = process.env.PORT || 9990;
const api: Router = Router();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

interface ImageFields {
	image?: Express.Multer.File[];
	watermark?: Express.Multer.File[];
}

type ImageFieldRequest = Request & { files: ImageFields };

api.post('/watermark', upload.fields([{ name: "image" }, { name: "watermark" }]), (req: ImageFieldRequest, res: any) => {
	const imageFile = req.files.image?.[0];
	const watermarkFile = req.files.watermark?.[0];
	const proc = spawn("bin/diwatermark",	[
		`uploads/${imageFile?.filename}`,
		`uploads/${watermarkFile?.filename}`,
		`wmarked/${imageFile?.filename}.png`,
		`wmarked/${imageFile?.filename}.bin`]);

	proc.on("error", (err) => {
		res.send(err);
	});

	proc.on("exit", () => {
		res.send('ok');
	});
});

app.use('/api', api);

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
