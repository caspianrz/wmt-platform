import { Button } from "~/components/ui/Button";
import type { Route } from "./+types/login";

import { Card } from "~/components/ui/Card";
import { Input } from "~/components/ui/Input";
import { Label } from "~/components/ui/Label";

export function meta({ }: Route.MetaArgs) {
	return [
		{ title: "Login" },
		{ name: "description", content: "Login Form." },
	];
}

export default function Login() {
	return (
		<Card>
			<Label>Username</Label>
			<Input type="text" />

			<Label>Password</Label>
			<Input type="password" />
		</Card>
	)
}
