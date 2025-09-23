import type { Route } from "./+types/watermark";

import { Box } from "@mui/material";

import Topbar from "@component/Topbar";
import WatermarkCreator from "@component/WatermarkCreator";

export function meta({ }: Route.MetaArgs) {
	return [
		{ title: "Upload Endpoint Tests" },
		{ name: "description", content: "Uploading Tests" },
	];
}

export default function Watermark() {
	return (
		<Box>
			<Topbar title="Watermark Creator" />

			<WatermarkCreator />
		</Box>
	);
}
