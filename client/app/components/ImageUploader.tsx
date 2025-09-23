import { Close as X, UploadFile } from "@mui/icons-material";
import { Box, Button, Card, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export function ImageUploader() {
	const [file, setFile] = useState<File | undefined>(undefined);
	const [image, setImage] = useState<string | undefined>(undefined);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const f = event.target.files?.[0];
		if (f && f.type.startsWith("image/")) {
			setFile(f);
		}
	};

	const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
		const f = event.dataTransfer.files?.[0];
		if (f && f.type.startsWith("image/")) {
			setFile(f);
		}
	};

	useEffect(() => {
		if (file != undefined) {
			setImage(URL.createObjectURL(file));
		} else {
			setImage(undefined);
		}
	}, [file]);

	return (
		<Card>
			{!image ? (
				<Card>
					<Button fullWidth sx={{ width: 512, height: 512 }} component="label">
						<Stack className="flex items-center justify-center" spacing={1}>
							<UploadFile fontSize="large" />
							<Typography>Choose Image</Typography>
						</Stack>
						<input
							type="file"
							accept="image/*"
							onChange={handleFileChange}
							onDrop={handleDrop}
							className="hidden"
							id="image-upload"
						/>
					</Button>
				</Card>
			) : (
				<div className="relative">
					<Box
						component="img"
						src={image}
						alt="Watermark File"
						sx={{
							width: 512,
							height: 512,
							borderRadius: 2,
							objectFit: "cover",
						}}
					/>
					<Button
						color="error" variant="contained" sx={{
							position: "absolute",
							right: 8,
							top: 8,
							width: 30,
							height: 30,
							minWidth: 0,
							padding: 0,
						}} onClick={() => { setFile(undefined) }}>
						<X fontSize="small" />
					</Button>
				</div>
			)}
		</Card>
	);
}
