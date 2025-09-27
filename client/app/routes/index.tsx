import type { Route } from "./+types/index";
import { Box, Typography } from "@mui/material";

export function meta({ }: Route.MetaArgs) {
	return [
		{ title: "Home" },
		{ name: "description", content: "Blind Watermarking Platform." },
	];
}

export default function Index() {
	return (
		<Box className="flex items-center justify-center h-screen" alignContent="center">
			<Typography variant="h1">Home</Typography>
		</Box>
	);
}
