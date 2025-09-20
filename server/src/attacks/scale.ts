import sharp from "sharp";

export default async function Scale(image: string, size: number) {
	await sharp(image)
		.metadata()
		.then(({ width }) => sharp(image)
			.resize(Math.round(width * size))
			.toFile(image)
		);
}
