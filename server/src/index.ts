import bodyParser from "body-parser";
import { createCanvas, Image } from "canvas";
import express from "express";
import { Application, Request, Response, Router } from "express";
import fs from 'fs';

const app: Application = express();
const port = process.env.PORT || 3000;

const api : Router = Router();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

api.post('/watermark', (req:Request, res:Response) => {
	const baseImage = new Image();
	const baseImageW = req.body.basew;
	const baseImageH = req.body.baseh;
	const watermark = new Image();
	const watermarkW = req.body.watermarkw;
	const watermarkH = req.body.watermarkh;

	const baseImageD = createCanvas(baseImageW, baseImageH);
	const watermarkD = createCanvas(watermarkW, watermarkH);
	
	baseImage.onload = () => baseImageD.getContext('2d').drawImage(baseImage, 0, 0);
	watermark.onload = () => watermarkD.getContext('2d').drawImage(watermark, 0, 0);

	const out = fs.createWriteStream(__dirname + '/test.jpeg')
	const stream = baseImageD.createJPEGStream();
	stream.pipe(out);

	const proc = spawn("bin/diwatermark", [
    "image2.jpg",
    `public/wm-${payload.userid}.jpg`,
    `public/image-${payload.userid}.jpg`,
    `public/image-${payload.userid}.bin`,
  ]);
});

app.use('/api', api);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
