import { Upload, X } from "lucide-react";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";

interface ImageUploaderProps {
	onImageUpload: ((file: File) => void) | null;
	uploadedImage: string | null;
	onRemoveImage: (() => void) | null;
	withHeader: boolean | null;
}

export function ImageUploader({
	onImageUpload,
	uploadedImage,
	onRemoveImage,
	withHeader,
}: ImageUploaderProps) {
	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (onImageUpload == null)
			return;
		const file = event.target.files?.[0];
		if (file && file.type.startsWith("image/")) {
			onImageUpload(file);
		}
	};

	const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
		if (onImageUpload == null)
			return;
		event.preventDefault();
		const file = event.dataTransfer.files[0];
		if (file && file.type.startsWith("image/")) {
			onImageUpload(file);
		}
	};

	const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
	};

	return (
		<Card className={withHeader ? "p-6" : "border-none"}>
			{withHeader ? (
				<h3 className="mb-4">Upload Image</h3>
			) : (
				<span className="hidden"></span>
			)}

			{!uploadedImage ? (
				<div
					onDrop={handleDrop}
					onDragOver={handleDragOver}
					className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
				>
					<Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
					<p className="mb-4 text-muted-foreground">
						Drag and drop an image here, or click to select
					</p>
					<input
						type="file"
						accept="image/*"
						onChange={handleFileChange}
						className="hidden"
						id="image-upload"
					/>
					<Button asChild variant="outline">
						<label htmlFor="image-upload" className="cursor-pointer">
							Choose Image
						</label>
					</Button>
				</div>
			) : (
				<div className="relative">
					<img
						src={uploadedImage}
						alt="Uploaded"
						className="w-full h-full object-cover rounded-lg"
					/>
					<Button
						onClick={() => { if (onRemoveImage != null) onRemoveImage(); }}
						variant="destructive"
						size="sm"
						className="absolute top-2 right-2"
					>
						<X className="w-4 h-4" />
					</Button>
				</div>
			)}
		</Card>
	);
}
