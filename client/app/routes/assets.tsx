import Topbar from "~/components/Topbar";
import type { Route } from "./+types/assets";

import {
	Container,
	Grid,
	Typography,
	Card,
	CardMedia,
	CardContent,
	CardActions,
	Button,
	Box,
	Divider,
	Fab,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import { ImageUploader } from "~/components/ImageUploader";
import EnvironmentManager from "~/models/EnvironmentManager";
import axios, { type AxiosResponse } from "axios";
import { useAuth } from "~/providers/AuthProvider";

export function meta({ }: Route.MetaArgs) {
	return [
		{ title: "Assets" },
		{ name: "description", content: "Assets List." },
	];
}

export default function Assets() {
	const auth = useAuth();
	const [images, setImages] = useState<{ id: string; url: string }[]>([]);
	const [open, setOpen] = useState(false);
	const [file, setFile] = useState<File | undefined>(undefined);

	const handleUpload = () => {
		if (!file) return;
		const endpoint = EnvironmentManager.Instance.endpoint('/api/upload');
		const form = new FormData();
		form.append('file', file);
		axios.post(endpoint.href, form, {
			headers: {
				Authorization: auth.token,
			}
		}).then((res: AxiosResponse) => {
			console.log(res);
			setFile(undefined);
			setOpen(false);
		});
	};

	return (
		<Box>
			<Topbar title="Uploaded Images" />
			<Container maxWidth="lg" sx={{ py: 4 }}>
				<Grid container justifyContent="center" spacing={2}>
					{[1, 2, 3, 4].map((id) => (
						<Grid key={`img-${id}`}>
							<Card>
								<CardMedia
									component="img"
									height="160"
									image={`https://picsum.photos/512/512?random=${id}`}
									alt={`Uploaded ${id}`}
								/>
								<CardContent>
									<Typography variant="subtitle2">Image {id}</Typography>
								</CardContent>
								<CardActions>
									<Button size="small">Add Watermark</Button>
								</CardActions>
							</Card>
						</Grid>
					))}
				</Grid>
			</Container>
			<Fab
				color="primary"
				aria-label="upload"
				sx={{ position: "fixed", bottom: 24, right: 24 }}
				onClick={() => setOpen(true)}
			>
				<AddIcon />
			</Fab>

			<Dialog open={open} onClose={() => setOpen(false)}>
				<DialogTitle>Upload Image</DialogTitle>
				<DialogContent>
					<ImageUploader file={file} setFile={setFile} />
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpen(false)}>Cancel</Button>
					<Button onClick={handleUpload} variant="contained" disabled={!file}>
						Upload
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
}
