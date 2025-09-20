import { renameSync } from 'fs';
import sharp from 'sharp';

function gaussianRandom(mean = 0, std = 1) {
	let u = 0, v = 0;
	while (u === 0) u = Math.random();
	while (v === 0) v = Math.random();
	const mag = Math.sqrt(-2.0 * Math.log(u));
	const z0 = mag * Math.cos(2.0 * Math.PI * v);
	return z0 * std + mean;
}

export default async function GaussianNoise(image: string, sigma: number = 25) {
	const { data, info } = await sharp(image)
		.raw()
		.toBuffer({ resolveWithObject: true });

	const out = Buffer.from(data); // copy 
	const { width, height, channels } = info;
	const hasAlpha = channels === 4;

	// iterate pixel-wise
	const pxCount = width * height;
	for (let p = 0; p < pxCount; p++) {
		const base = p * channels;
		// apply noise per colour channel (skip alpha if present)
		for (let c = 0; c < channels; c++) {
			if (hasAlpha && c === 3) {
				// preserve alpha exactly
				out[base + c] = (data[base + c] || 0);
				continue;
			}
			const orig = (data[base + c] || 0);
			const n = gaussianRandom(0, sigma);
			let val = Math.round(orig + n);
			if (val < 0) val = 0;
			if (val > 255) val = 255;
			out[base + c] = val;
		}
	}

	// write the noisy image using raw input description
	await sharp(out, {
		raw: { width, height, channels }
	}).toFile(`${image}.jpg`);

	renameSync(`${image}.jpg`, image);
}
