import { useState } from "react";
import type { Route } from "./+types/register";


import EnvironmentManager from "~/models/EnvironmentManager";

import { Card } from "~/components/ui/Card";
import { Input } from "~/components/ui/Input";
import { Label } from "~/components/ui/Label";
import axios from "axios";
import { redirect, useSubmit } from "react-router";
import { Button } from "~/components/ui/Button";

export function meta({ }: Route.MetaArgs) {
	return [
		{ title: "Registeration" },
		{ name: "description", content: "Registeration Form." },
	];
}

export default function Register() {
	const [username, setUsername] = useState('Username');
	const [password, setPassword] = useState('')

	const onSubmit = () => {
		console.log("Submit");
		axios.post(EnvironmentManager.Instance.endpoint('/api/auth/register').href, {
			username: username,
			password: password,
		});
		redirect('/');
	};

	return (
		<Card>
			<form onSubmit={onSubmit}>
				<Label>Username</Label>
				<Input type="text" onChange={(e) => setUsername(e.target.value)} />

				<Label>Password</Label>
				<Input type="password" onChange={(e) => setPassword(e.target.value)} />

				<Button>Submit</Button>
			</form>
		</Card>
	)
}
