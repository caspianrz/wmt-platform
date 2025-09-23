import type { Route } from "./+types/login";

import { Box } from "@mui/material";

import AuthenticationForm from "@component/AuthenticationForm";

export function meta({ }: Route.MetaArgs) {
	return [
		{ title: "Login" },
		{ name: "description", content: "" },
	];
}

export default function Login() {
	return (
		<div className="flex items-center justify-center h-screen">
			<Box>
				<AuthenticationForm />
			</Box>
		</div>
	)
}
