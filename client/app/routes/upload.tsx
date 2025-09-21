import type { Route } from "./+types/upload"
import { Label } from "~/components/ui/Label";
import { Input } from "~/components/ui/Input";
import { Button } from "~/components/ui/Button";
import { Card } from "~/components/ui/Card";
import { useState } from "react";
import axios from "axios";
import EnvironmentManager from "~/models/EnvironmentManager";

export function meta({ }: Route.MetaArgs) {
	return [
		{ title: "Upload Endpoint Tests" },
		{ name: "description", content: "Uploading Tests" },
	];
}

export default function Upload() {
	const [file, setFile] = useState<File | null>(null);
	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			setFile(file);
		}
	};

	const handleUpload = () => {
		if (file) {
			const endpoint = new URL('/api/upload', document.location.origin);
			endpoint.port = EnvironmentManager.Instance.SERVER_PORT;

			const formData = new FormData();
			formData.append('file', file);
			axios.post(endpoint.href, formData, {
				headers: { "Content-Type": "multipart/form-data" },
			}).then((res: any) => {
				console.log(res);
			});
		}
	}

	return (
		<Card>
			<Label htmlFor="file">File</Label>
			<Input id="file" type="file" onChange={handleFileChange}></Input>
			<Button disabled={file == null} onClick={handleUpload}>Submit</Button>
		</Card>
	);
}
