export default function loadImage(file: File): Promise<string> {
	return new Promise((resolve) => {
		/*
		const reader = new FileReader();
		reader.onload = (e) => {
			console.log(e.target);
			resolve(e.target?.result as string);
		}
		reader.readAsDataURL(file);
		*/

		const img = new Image();

		img.onload = () => {
			const canvas = document.createElement("canvas");
			canvas.width = 1024;
			canvas.height = 1024;

			const ctx = canvas.getContext("2d");
			if (!ctx) return;

			ctx.drawImage(img, 0, 0, 1024, 1024);

			// Export as PNG dataURL
			const pngDataURL = canvas.toDataURL("image/png");
			resolve(pngDataURL);
		};
		img.src = URL.createObjectURL(file);
	});
}
