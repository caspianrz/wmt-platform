import { Button, FormControl, Input, InputLabel, MenuItem, Select, Stack } from "@mui/material";
import React from "react";
import { ImageUploader } from "./ImageUploader";

/**
 * This is the component that allows only uploading an image as watermark,
 * or placing a text in a watermark.
 */
function BasicWatermarkCreator() {
	const [type, setType] = React.useState(0);
	const [filename, setFileName] = React.useState('');

	return (
		<Stack spacing={1} mt={4}>
			<FormControl fullWidth>
				<InputLabel id="select-watermark-kind-label">Type</InputLabel>
				<Select
					labelId="select-watermark-kind-label"
					id="select-watermark-kind"
					value={type}
					label="Type"
					onChange={(e) => setType(e.target.value)}
				>
					<MenuItem value={0}>Image</MenuItem>
					<MenuItem value={1}>Text</MenuItem>
				</Select>
			</FormControl>

			{type == 0 && (
				<ImageUploader />
			)}

			{type == 1 && (
				<FormControl fullWidth>
				
				</FormControl>
			)}

			<FormControl>
				<InputLabel htmlFor="filename-input">File Name</InputLabel>
				<Input value={filename} type="text" id="filename-input" onChange={(e) => setFileName(e.target.value)} />
			</FormControl>
			<Button variant="contained">Save</Button>
		</Stack>
	);
}

export default function WatermarkCreator() {
	return (
		<div className="flex justify-center">
			<BasicWatermarkCreator />
		</div>
	);
}
