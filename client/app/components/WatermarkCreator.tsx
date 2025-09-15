import { useState } from "react";
import { ImageUploader } from "./ImageUploader";
import { Card } from "./ui/Card";
import WatermarkSetting from "./WatermarkSetting";
import { Label } from "./ui/Label";
import { Slider } from "./ui/Slider";
import { Button } from "./ui/Button";
import ImageUploaderToWatermark from "~/models/ImageUploaderToWatermark";
import loadImage from "./ImageProcessor";


export default function WatermarkCreator() {
	const [opacity, setOpacity] = useState(100);
	const [image, setImage] = useState<string | null>(null);
	const [watermark, setWatermark] = useState<string | null>(null);

	const setImageData = async (file: File) => {
		const data = await loadImage(file);
		setImage(data);
	};

	const removeImageData = () => {
		setImage(null);
	}

	const applyWatermark = () => {
		if (image == null || watermark == null) {
			return;
		}
		ImageUploaderToWatermark({
			image: image,
			watermark: watermark,
			alpha: opacity
		}, (res) => {
			console.log(res.data);
		}, null);
	};

	return (
		<Card className="p-2">
			<Card className="p-2">
				<h3 className="text-xl">Image</h3>
				<ImageUploader
					onImageUpload={setImageData}
					uploadedImage={image}
					onRemoveImage={removeImageData}
					withHeader={false}
				/>
			</Card>
			<WatermarkSetting
				watermark={watermark}
				setWatermark={setWatermark}
			/>
			<Label htmlFor="watermark-opacity">Opacity: {opacity}%</Label>
			<Slider
				id="watermark-opacity"
				min={10}
				max={100}
				step={5}
				value={[opacity]}
				onValueChange={(value) => setOpacity(value[0])}
				className="mt-2"
			/>
			<Button
				onClick={applyWatermark}
				disabled={watermark == null || image == null}
				className="w-full"
			>
				Apply Watermark
			</Button>
		</Card>
	);
}
