import type { Route } from "./+types/watermarking";

import {
	Box,
	Grid,
	Typography,
	Card,
	CardMedia,
	Button,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
	Dialog,
	DialogContent,
	DialogTitle,
	ImageList,
	ImageListItem,
} from "@mui/material";
import axios from "axios";

import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Topbar from "~/components/Topbar";
import EnvironmentManager from "~/models/EnvironmentManager";
import { useAuth } from "~/providers/AuthProvider";

export function meta({ }: Route.MetaArgs) {
	return [
		{ title: "Watermarking" },
		{ name: "description", content: "Watermarking an image." },
	];
}

interface Watermark { id: string; url: string };

function WatermarkList({ watermarks, onSelect }: {
	watermarks: Watermark[];
	onSelect: (id: string) => void;
}) {
	const [selected, setSelected] = useState<string | null>(null);
	const { uuid } = useParams();

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				overflowY: "auto",
				border: "1px solid #ccc",
				borderRadius: 2,
				p: 1,
				scrollbarColor: "#555 #1e1e2e",
				scrollbarWidth: "thin",
			}}
		>
			{watermarks.length > 0 && (<Box>
				<Typography variant="h6" gutterBottom>
					Select a Watermark
				</Typography>

				<ImageList variant="masonry" gap={1}>
					{watermarks.map((wm) => (
						<ImageListItem
							key={wm.id}
							onClick={() => {
								setSelected(wm.id);
								onSelect(wm.id);
							}}
							sx={{
								cusor: "pointer",
								border: selected === wm.id ? "2px solid #1976d2" : "2px solid transparent",
								borderRadius: 1,
								transition: "border 0.2s",
								width: 256,
							}}
						>
							<img
								src={wm.url}
								alt={wm.id}
								style={{ objectFit: "cover" }}
							/>
						</ImageListItem>
					))}
				</ImageList>
			</Box>)}
			<Box sx={{ marginTop: "auto" }}>
				<Button href={`/watermark?redirect=/watermarking/${uuid}`}>Upload Watermark</Button>
			</Box>
		</Box>
	);
}

export default function WatermarkingPage() {
	const [selectedImage, setSelectedImage] = useState('');

	// Placeholder watermarks
	const [watermarks, setWatermarks] = useState<Watermark[]>([]);
	const { uuid } = useParams();
	const auth = useAuth();
	const [open, setOpen] = useState(false);
	const [selectedWatermark, setSelectedWatermark] = useState<Watermark>(watermarks[0]);

	const selectWatermark = (id: string) => {
		let i = 0;
		for (i = 0; i < watermarks.length; i++) {
			if (watermarks[i].id == id) {
				setSelectedWatermark(watermarks[i]);
				break;
			}
		}
	};

	const populateWatermarks = () => {
		const endpoint = EnvironmentManager.Instance.endpoint('/api/watermark');
		axios.get(endpoint.href, {
			headers: {
				"Authorization": auth.token
			}
		}).then((res) => {
			if (res.status == 200) {
				const wd: Watermark[] = res.data.map((d: any) => {
					return { id: d._id, url: EnvironmentManager.Instance.endpoint(`/api/${d.path}`) }
				});
				setWatermarks(wd);
			}
		});
	}

	useEffect(() => {
		populateWatermarks();
		setSelectedImage(EnvironmentManager.Instance.endpoint(`/api/uploads/${auth.user}/assets/${uuid}`).href);
	});

	// Placeholder strategies
	const strategies = ["Blind DCT", "LSB", "Hybrid", "Wavelet"];

	return (
		<Box sx={{
			height: "100vh",      // full viewport height
			display: "flex",
			flexDirection: "column",
		}}>
			<Topbar title="Watermarking" />
			<Grid container spacing={2} p={2} height="100%">
				<Grid sx={{
					flex: 1,
					border: "1px solid #ccc",
					borderRadius: 2,
					p: 2,
				}}>
					<Typography variant="h6" gutterBottom>
						Selected Image
					</Typography>
					<Card sx={{ maxWidth: "100%" }}>
						<CardMedia
							component="img"
							sx={{ height: 256 }}
							image={selectedImage}
							alt="Selected user image"
						/>
					</Card>
				</Grid>

				<Grid sx={{ display: "flex", flex: 4 }} >
					<WatermarkList watermarks={watermarks} onSelect={(id) => selectWatermark(id)} />
				</Grid>

				{/* Right column: strategies + options */}
				<Grid sx={{
					flex: 1,
					border: "1px solid #ccc",
					borderRadius: 2,
					p: 2,
				}}>
					<Typography variant="h6" gutterBottom>
						Watermarking Strategy
					</Typography>
					<List>
						{strategies.map((s) => (
							<ListItem key={s} disablePadding>
								<ListItemButton>
									<ListItemText primary={s} />
								</ListItemButton>
							</ListItem>
						))}
					</List>
					<Button
						variant="contained"
						fullWidth
						onClick={() => setOpen(true)}
					>
						Apply Watermark
					</Button>
				</Grid>
			</Grid>

			{/* Overlay for watermarked result */}
			<Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
				<DialogTitle>Watermarked Image</DialogTitle>
				<DialogContent>
					<Card>
						<CardMedia
							component="img"
							image="https://via.placeholder.com/400?text=Watermarked+Image"
							alt="Watermarked result"
						/>
					</Card>
					<Box mt={2} display="flex" gap={2}>
						<Button variant="outlined" onClick={() => setOpen(false)}>
							Close
						</Button>
						<Button variant="contained" color="secondary">
							Go to Analysis
						</Button>
					</Box>
				</DialogContent>
			</Dialog>
		</Box>
	);
}
