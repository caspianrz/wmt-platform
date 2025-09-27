import Topbar from "~/components/Topbar";
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
		<Box>
			<Topbar title={"Home"} />
			<Box className="flex items-center justify-center" alignContent="center">
				<Typography variant="h1">Home</Typography>
			</Box>
		</Box>
	);
}
