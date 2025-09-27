import Topbar from "~/components/Topbar";
import type { Route } from "./+types/watermarks";

import {
	Container,
	Grid,
	Card,
	CardMedia,
	CardContent,
	CardActions,
	Button,
	Typography,
	Box,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import EnvironmentManager from "~/models/EnvironmentManager";
import { useAuth } from "~/providers/AuthProvider";

export function meta({ }: Route.MetaArgs) {
	return [
		{ title: "Watermarks" },
		{ name: "description", content: "You can see watermarks here." },
	];
}

interface WatermarkPreviewData {
	id: string,
	url: string,
}

export default function WatermarksPage() {
	const auth = useAuth();
	const [watermarks, setWatermarks] = useState<WatermarkPreviewData[]>([]);

	const deleteWatermark = (id: string) => {
		const endpoint = EnvironmentManager.Instance.endpoint('/api/watermark');
		axios.delete(endpoint.href, {
			headers: {
				Authorization: auth.token
			},
			data: {
				id: id
			},
		}).then((res) => {
			console.log(res);
			setWatermarks(watermarks.filter((wm) => {
				return wm.id != id;
			}));
		});
	}

	useEffect(() => {
		const endpoint = EnvironmentManager.Instance.endpoint('/api/watermark');
		axios.get(endpoint.href, {
			headers: {
				"Authorization": auth.token
			}
		}).then((res) => {
			if (res.status == 200) {
				const wd: WatermarkPreviewData[] = res.data.map((d: any) => {
					return { id: d._id, url: EnvironmentManager.Instance.endpoint(`/api/${d.path}`) }
				});
				setWatermarks(wd);
			}
		});
	}, []);

	return (
		<Box>
			<Topbar title="Your watermarks" />

			<Container maxWidth="lg" sx={{ py: 4 }}>
				{watermarks.length > 0 ? (
					<Grid container spacing={3}>
						{watermarks.map((wm) => (
							<Grid key={wm.id}>
								<Card>
									<CardMedia
										component="img"
										image={wm.url}
										alt={wm.id}
										sx={{ height: 256, objectFit: "cover" }}
									/>
									<CardContent>
										<Typography variant="subtitle1">{wm.id}</Typography>
									</CardContent>
									<CardActions>
										<Button size="small" color="error" onClick={() => deleteWatermark(wm.id)}>
											Delete
										</Button>
									</CardActions>
								</Card>
							</Grid>
						))}
					</Grid>
				) : (
					<Typography>No watermarks yet.</Typography>
				)}
			</Container>
		</Box>
	);
}
